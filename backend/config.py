import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    # Use simpler SQLite path - just "app.db" in the backend directory
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", "sqlite:///app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB uploads
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", os.path.abspath("uploads"))
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")  # lock this down in production
