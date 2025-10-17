from datetime import datetime
from .extensions import db

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticket = db.Column(db.String(16), unique=True, nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(64), nullable=True)
    body = db.Column(db.Text, nullable=False)         # TODO: switch to ciphertext later
    code_hash = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(24), default='open')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('report.id'), nullable=False)
    role = db.Column(db.String(16), nullable=False)  # 'reporter' or 'moderator'
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    report = db.relationship('Report', backref=db.backref('messages', lazy=True, order_by="Message.created_at"))
