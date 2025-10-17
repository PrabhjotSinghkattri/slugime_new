import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", "sqlite:///app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production-" + os.urandom(16).hex())
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
    # App toggles
    STORE_IP = False  # do not store requester IPs