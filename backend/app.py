import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

# Local imports
from config import Config
from database import db
from models import Report, Message, User, Post, Comment, Like, Save
from schemas import (
    ReportCreateSchema, MessageCreateSchema, ReportPublicSchema,
    RegisterSchema, LoginSchema, UserPublicSchema, CommentPublicSchema
)
from security import (
    gen_ticket_id, gen_access_code, hash_code, verify_code,
    issue_token, verify_token
)

# Load environment variables
load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    # Setup CORS (Cross-Origin Resource Sharing)
    cors_origins = app.config.get("CORS_ORIGINS", "*")
    CORS(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=False)

    # Initialize SQLAlchemy
    db.init_app(app)

    # Create necessary folders and tables
    with app.app_context():
        # Ensure instance folder exists for SQLite database
        os.makedirs("instance", exist_ok=True)
        os.makedirs(app.config.get("UPLOAD_FOLDER", "uploads"), exist_ok=True)
        db.create_all()

    # -----------------------
    # Helper Functions
    # -----------------------
    def get_current_user():
        """
        Extract and validate the current user from the Authorization header.
        Returns User object if valid, None otherwise.
        """
        auth = request.headers.get("Authorization", "")
        parts = auth.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            data = verify_token(parts[1])
            if data and (uid := data.get("uid")):
                user = User.query.get(uid)
                if user:
                    return user
        return None

    def get_report_or_404(ticket: str):
        """Fetch a report by ticket or return None if not found."""
        return Report.query.filter_by(ticket=ticket).first()

    def require_code_and_report(ticket: str):
        """Verify report access using access code."""
        code = request.args.get("code", "") or request.headers.get("X-Access-Code", "")
        rpt = get_report_or_404(ticket)
        if not rpt:
            return None, jsonify({"error": "Not found"}), 404
        if not code or not verify_code(code, rpt.code_hash):
            return None, jsonify({"error": "Forbidden"}), 403
        return rpt, None, None

    # -----------------------
    # Auth Routes
    # -----------------------
    @app.post("/api/v1/auth/register")
    def register():
        payload = request.get_json(silent=True) or {}
        errors = RegisterSchema().validate(payload)
        if errors:
            return jsonify({"errors": errors}), 400

        # Check if user already exists
        if User.query.filter_by(email=payload["email"].lower()).first():
            return jsonify({"error": "Email already registered"}), 400

        # Create new user
        user = User(
            email=payload["email"].lower(),
            name=payload["name"],
            password_hash=generate_password_hash(payload["password"]),
            avatar_url=None,
            verified=False,
        )
        db.session.add(user)
        db.session.commit()

        token = issue_token({"uid": user.id})
        return jsonify({"token": token, "user": UserPublicSchema().dump(user)}), 201

    @app.post("/api/v1/auth/login")
    def login():
        payload = request.get_json(silent=True) or {}
        errors = LoginSchema().validate(payload)
        if errors:
            return jsonify({"errors": errors}), 400

        user = User.query.filter_by(email=payload["email"].lower()).first()
        if not user or not check_password_hash(user.password_hash, payload["password"]):
            return jsonify({"error": "Invalid credentials"}), 401

        token = issue_token({"uid": user.id})
        return jsonify({"token": token, "user": UserPublicSchema().dump(user)}), 200

    # -----------------------
    # Feed Routes
    # -----------------------
    @app.get("/api/v1/feed")
    def get_feed():
        user = get_current_user()
        posts = Post.query.order_by(Post.created_at.desc()).limit(20).all()
        items = []
        for p in posts:
            like_count = len(p.likes)
            comment_count = len(p.comments)
            liked = False
            saved = False
            if user:
                liked = any(l.user_id == user.id for l in p.likes)
                saved = any(s.user_id == user.id for s in p.saves)
            items.append({
                "id": p.id,
                "caption": p.caption,
                "image_url": p.image_url,
                "created_at": p.created_at.isoformat(),
                "author": {
                    "id": p.author.id,
                    "email": p.author.email,
                    "name": p.author.name,
                    "avatar_url": p.author.avatar_url,
                    "verified": p.author.verified,
                },
                "like_count": like_count,
                "comment_count": comment_count,
                "liked": liked,
                "saved": saved,
            })
        return jsonify({"posts": items}), 200

    @app.post("/api/v1/posts")
    def create_post():
        user = get_current_user()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        payload = request.get_json(silent=True) or {}
        image_url = (payload.get("image_url") or "").strip()
        caption = (payload.get("caption") or "").strip()
        if not image_url:
            return jsonify({"error": "image_url required"}), 400
        p = Post(user_id=user.id, image_url=image_url, caption=caption)
        db.session.add(p)
        db.session.commit()
        return jsonify({"id": p.id}), 201

    @app.post("/api/v1/posts/<int:post_id>/like")
    def like_post(post_id: int):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401

        post = Post.query.get_or_404(post_id)
        existing = Like.query.filter_by(post_id=post.id, user_id=user.id).first()
        if existing:
            db.session.delete(existing)
            db.session.commit()
            liked = False
        else:
            like = Like(post_id=post.id, user_id=user.id)
            db.session.add(like)
            db.session.commit()
            liked = True

        return jsonify({"liked": liked, "like_count": len(post.likes)}), 200

    @app.post("/api/v1/posts/<int:post_id>/save")
    def save_post(post_id: int):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401

        post = Post.query.get_or_404(post_id)
        existing = Save.query.filter_by(post_id=post.id, user_id=user.id).first()
        if existing:
            db.session.delete(existing)
            db.session.commit()
            saved = False
        else:
            s = Save(post_id=post.id, user_id=user.id)
            db.session.add(s)
            db.session.commit()
            saved = True

        return jsonify({"saved": saved}), 200

    @app.post("/api/v1/posts/<int:post_id>/comments")
    def add_comment(post_id: int):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        body = (request.get_json(silent=True) or {}).get("body", "").strip()
        if not body:
            return jsonify({"error": "Body required"}), 400

        post = Post.query.get_or_404(post_id)
        c = Comment(post_id=post.id, user_id=user.id, body=body)
        db.session.add(c)
        db.session.commit()
        return jsonify({
            "comment": CommentPublicSchema().dump(c),
            "comment_count": len(post.comments)
        }), 201

    # -----------------------
    # Report Routes
    # -----------------------
    @app.get("/api/v1/reports/public")
    def get_public_reports():
        """Get public whistleblower reports for the main feed"""
        reports = Report.query.filter_by(status="open").order_by(Report.created_at.desc()).limit(20).all()

        items = []
        for rpt in reports:
            items.append({
                "id": f"report_{rpt.id}",
                "type": "report",
                "ticket": rpt.ticket,
                "title": rpt.title,
                "category": rpt.category,
                "body": rpt.body[:200] + "..." if len(rpt.body) > 200 else rpt.body,
                "created_at": rpt.created_at.isoformat(),
                "author": {
                    "id": None,
                    "email": None,
                    "name": "Anonymous Whistleblower",
                    "avatar_url": "https://via.placeholder.com/40x40/ffd700/000000?text=W",
                    "verified": True,
                },
                "like_count": 0,
                "comment_count": len(rpt.messages),
                "liked": False,
                "saved": False,
                "status": rpt.status,
            })

        return jsonify({"reports": items}), 200

    @app.post("/api/v1/reports")
    def create_report():
        form = request.get_json(silent=True) or {}
        errors = ReportCreateSchema().validate(form)
        if errors:
            return jsonify({"errors": errors}), 400

        ticket = gen_ticket_id()
        code = gen_access_code()

        rpt = Report(
            ticket=ticket,
            title=form["title"].strip(),
            category=form.get("category", "").strip() or None,
            body=form["body"].strip(),
            code_hash=hash_code(code),
        )
        db.session.add(rpt)
        db.session.commit()

        return jsonify({"ticket": ticket, "access_code": code}), 201

    @app.get("/api/v1/reports/<ticket>")
    def get_report(ticket: str):
        """Get a specific report by ticket (requires access code)"""
        rpt, err_resp, err_code = require_code_and_report(ticket)
        if err_resp:
            return err_resp, err_code
        
        return jsonify(ReportPublicSchema().dump(rpt)), 200

    @app.post("/api/v1/reports/<ticket>/messages")
    def post_report_message(ticket: str):
        """Post a message to a report (requires access code)"""
        rpt, err_resp, err_code = require_code_and_report(ticket)
        if err_resp:
            return err_resp, err_code
        
        payload = request.get_json(silent=True) or {}
        errors = MessageCreateSchema().validate(payload)
        if errors:
            return jsonify({"errors": errors}), 400

        msg = Message(
            report_id=rpt.id,
            body=payload["body"].strip(),
            author="user"
        )
        db.session.add(msg)
        db.session.commit()

        return jsonify({"message": "Message posted", "id": msg.id}), 201

    return app


app = create_app()

if __name__ == "__main__":
    # Use debug=False to avoid reloader path issues on Windows
    app.run(host="127.0.0.1", port=5000, debug=False)
