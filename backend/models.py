from datetime import datetime
from database import db

class Report(db.Model):
    __tablename__ = "reports"
    id = db.Column(db.Integer, primary_key=True)
    ticket = db.Column(db.String(24), unique=True, index=True, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(120), nullable=True)
    body = db.Column(db.Text, nullable=False)
    code_hash = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default="open", nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    messages = db.relationship("Message", backref="report", cascade="all, delete-orphan", order_by="Message.created_at")

class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    body = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(32), default="user", nullable=False)  # "user" | "staff"
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
