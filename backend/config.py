import os
import secrets

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))
    # Use instance folder for database
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", "sqlite:///instance/app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB uploads
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", os.path.abspath("uploads"))
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")  # lock this down in production
