import os
from flask import Flask
from .config import Config
from .extensions import cors, db, ma, talisman
from .routes import api_bp
from .logging_cfg import configure_logging

app = Flask(__name__)
app.config.from_object(Config)

configure_logging(app)

cors.init_app(app, resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}})
db.init_app(app)
ma.init_app(app)

# Security headers
csp = {
    'default-src': "'self'",
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:'],
}
talisman.init_app(app, content_security_policy=csp, force_https=False)

# Blueprints
app.register_blueprint(api_bp, url_prefix="/api/v1")

# Create DB if not exists
with app.app_context():
    from . import models  # noqa
    db.create_all()