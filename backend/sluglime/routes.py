from flask import Blueprint, request, jsonify, current_app
from .extensions import db
from .models import Report, Message
from .schemas import ReportCreateSchema, ReportPublicSchema, MessageSchema
from .security import gen_ticket_id, gen_access_code, hash_code, verify_code

api_bp = Blueprint('api', __name__)

@api_bp.post('/reports')
def create_report():
    # Handle both JSON and form data (for file uploads)
    if request.is_json:
        data = request.get_json() or {}
        errors = ReportCreateSchema().validate(data)
        if errors:
            return jsonify({"errors": errors}), 400
        
        title = data['title'].strip()
        category = (data.get('category') or '').strip() or None
        body = data['body'].strip()
    else:
        # Handle form data with files
        title = request.form.get('title', '').strip()
        body = request.form.get('body', '').strip()
        category = None
        
        if not title or not body:
            return jsonify({"error": "title and body are required"}), 400

    ticket = gen_ticket_id()
    code = gen_access_code()

    try:
        r = Report(
            ticket=ticket,
            title=title,
            category=category,
            body=body,
            code_hash=hash_code(code),
        )
        db.session.add(r)
        db.session.commit()
        
        # Handle file uploads if present
        if not request.is_json:
            files = request.files
            for key, file in files.items():
                if file and file.filename:
                    # In a real implementation, you would save the file
                    # For now, we'll just log that a file was uploaded
                    current_app.logger.info(f"File uploaded: {file.filename} for report {ticket}")
                    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Failed to create report: {str(e)}")
        return jsonify({"error": "database_error"}), 500

    # Do NOT persist the raw code; return once
    return jsonify({
        "ticket": ticket,
        "access_code": code
    }), 201

@api_bp.get('/reports/<ticket>')
def get_report(ticket):
    # Validate ticket format
    if not ticket or len(ticket) != 8 or not ticket.isalnum():
        return jsonify({"error": "invalid_ticket"}), 400
    
    code = request.args.get('code', '')
    r = Report.query.filter_by(ticket=ticket).first()
    if not r:
        return jsonify({"error": "not_found"}), 404
    if not verify_code(code, r.code_hash):
        return jsonify({"error": "unauthorized"}), 401

    payload = ReportPublicSchema().dump(r)
    payload["messages"] = MessageSchema(many=True).dump(r.messages)
    return jsonify(payload), 200

@api_bp.post('/reports/<ticket>/messages')
def post_message(ticket):
    # Validate ticket format
    if not ticket or len(ticket) != 8 or not ticket.isalnum():
        return jsonify({"error": "invalid_ticket"}), 400
    
    code = request.args.get('code', '')
    r = Report.query.filter_by(ticket=ticket).first()
    if not r:
        return jsonify({"error": "not_found"}), 404
    if not verify_code(code, r.code_hash):
        return jsonify({"error": "unauthorized"}), 401

    body = (request.get_json() or {}).get('body', '').strip()
    if not body:
        return jsonify({"error": "empty_message"}), 400

    try:
        m = Message(report_id=r.id, role='reporter', body=body)
        db.session.add(m)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Failed to add message: {str(e)}")
        return jsonify({"error": "database_error"}), 500
    
    return jsonify({"ok": True}), 201

# add near your other imports
from typing import List

# --- Add this route to your module ---
@api_bp.post('/ml/toxicity')
def ml_toxicity():
    """
    POST /ml/toxicity
    Body:
      {
        "texts": ["string", "string", ...]   # OR "text": "single string"
        "threshold": 0.85,                   # optional, default 0.85 (like tfjs)
        "multilingual": false                # optional, use 'multilingual' Detoxify model
      }

    Response (shape inspired by @tensorflow-models/toxicity):
      {
        "threshold": 0.85,
        "model": "detoxify-original",        # or "detoxify-multilingual"
        "predictions": [
          {
            "label": "toxicity",
            "results": [
              {"index": 0, "probability": 0.92, "match": true},
              ...
            ]
          },
          ...
        ]
      }
    """
    data = request.get_json() or {}

    # Accept either "text" (single) or "texts" (list)
    texts: List[str] = []
    if isinstance(data.get('texts'), list):
        texts = [t for t in data['texts'] if isinstance(t, str) and t.strip()]
    elif isinstance(data.get('text'), str) and data['text'].strip():
        texts = [data['text'].strip()]

    if not texts:
        return jsonify({"error": "bad_request", "detail": "Provide 'text' or 'texts' with non-empty strings."}), 400

    # Threshold defaults to TFJS toxicity’s common 0.85
    try:
        threshold = float(data.get('threshold', 0.85))
    except (TypeError, ValueError):
        threshold = 0.85

    multilingual = bool(data.get('multilingual', False))

    # Lazy import so your app still runs if detoxify isn't installed
    try:
        from detoxify import Detoxify
    except Exception as e:
        return jsonify({
            "error": "not_implemented",
            "detail": "Server-side toxicity requires 'detoxify' (and PyTorch). "
                      "Install with: pip install detoxify torch torchvision --extra-index-url https://download.pytorch.org/whl/cpu",
        }), 501

    # Load model (original = English; multilingual for broader languages)
    model_name = 'multilingual' if multilingual else 'original'
    model = Detoxify(model_name)

    # Predict; Detoxify supports batch input (list[str]).
    # Returns dict: label -> list[float] with same length as texts
    raw = model.predict(texts)

    # Map to the TFJS toxicity label set & response shape
    # (Detoxify already uses the same keys.)
    LABELS = [
        "toxicity",
        "severe_toxicity",
        "obscene",
        "identity_attack",
        "insult",
        "threat",
        "sexual_explicit",
    ]

    predictions = []
    for label in LABELS:
        probs = raw.get(label, [None] * len(texts))
        results = []
        for i, p in enumerate(probs):
            # Ensure a float; None => 0.0 (no score)
            prob = float(p) if p is not None else 0.0
            results.append({
                "index": i,
                "probability": prob,
                "match": prob >= threshold
            })
        predictions.append({
            "label": label,
            "results": results
        })

    return jsonify({
        "threshold": threshold,
        "model": f"detoxify-{model_name}",
        "predictions": predictions
    }), 200
