import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

from config import Config
from database import db
from models import Report, Message
from schemas import ReportCreateSchema, MessageCreateSchema, ReportPublicSchema
from security import gen_ticket_id, gen_access_code, hash_code, verify_code

load_dotenv()

def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}}, supports_credentials=False)

    db.init_app(app)
    with app.app_context():
        os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
        db.create_all()

    # ---- Helpers ----
    def get_report_or_404(ticket: str) -> Report:
        r = Report.query.filter_by(ticket=ticket).first()
        if not r:
            return None
        return r

    def require_code_and_report(ticket: str):
        code = request.args.get("code", "") or request.headers.get("X-Access-Code", "")
        rpt = get_report_or_404(ticket)
        if not rpt:
            return None, jsonify({"error": "Not found"}), 404
        if not code or not verify_code(code, rpt.code_hash):
            return None, jsonify({"error": "Forbidden"}), 403
        return rpt, None, None

    # ---- Routes ----
    @app.post("/api/v1/reports")
    def create_report():
        """
        Accepts multipart/form-data (FormData) OR JSON.
        Fields: title, category (optional), body. Can be extended to handle files.
        """
        if request.content_type and request.content_type.startswith("multipart/form-data"):
            form = request.form.to_dict()
        else:
            form = request.get_json(silent=True) or {}

        errors = ReportCreateSchema().validate(form)
        if errors:
            return jsonify({"errors": errors}), 400

        ticket = gen_ticket_id()
        code = gen_access_code()

        rpt = Report(
            ticket=ticket,
            title=form["title"].strip(),
            category=(form.get("category") or "").strip() or None,
            body=form["body"].strip(),
            code_hash=hash_code(code),
        )
        db.session.add(rpt)
        db.session.commit()

        # Important: never store or re-show the raw code again
        return jsonify({"ticket": ticket, "access_code": code}), 201

    @app.get("/api/v1/reports/<ticket>")
    def get_report(ticket):
        """
        Returns the full report (including messages) if a valid ?code= is supplied.
        """
        rpt, err_resp, status = require_code_and_report(ticket)
        if err_resp:
            return err_resp, status

        data = ReportPublicSchema().dump(rpt)
        return jsonify(data), 200

    @app.post("/api/v1/reports/<ticket>/messages")
    def add_message(ticket):
        """
        Accepts JSON: { "body": "..." }
        Needs ?code=... to authorize the ticket owner (user).
        """
        rpt, err_resp, status = require_code_and_report(ticket)
        if err_resp:
            return err_resp, status

        payload = request.get_json(silent=True) or {}
        errors = MessageCreateSchema().validate(payload)
        if errors:
            return jsonify({"errors": errors}), 400

        msg = Message(report_id=rpt.id, body=payload["body"].strip(), author="user")
        db.session.add(msg)
        db.session.commit()
        return jsonify({"id": msg.id, "ok": True}), 201

    # Optional: list messages only (handy for polling)
    @app.get("/api/v1/reports/<ticket>/messages")
    def list_messages(ticket):
        rpt, err_resp, status = require_code_and_report(ticket)
        if err_resp:
            return err_resp, status
        msgs = [
            {"id": m.id, "body": m.body, "author": m.author, "created_at": m.created_at.isoformat()}
            for m in rpt.messages
        ]
        return jsonify({"messages": msgs}), 200

    # Optional: update status (e.g., close)
    @app.patch("/api/v1/reports/<ticket>/status")
    def update_status(ticket):
        rpt, err_resp, status = require_code_and_report(ticket)
        if err_resp:
            return err_resp, status
        body = request.get_json(silent=True) or {}
        new_status = (body.get("status") or "").lower()
        if new_status not in {"open", "closed"}:
            return jsonify({"error": "Invalid status"}), 400
        rpt.status = new_status
        db.session.commit()
        return jsonify({"ok": True, "status": rpt.status}), 200

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
