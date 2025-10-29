import os, secrets, string
from passlib.hash import argon2
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from config import Config

# ---- Constants ----
TICKET_ALPHABET = string.ascii_uppercase + string.digits
CODE_ALPHABET = string.ascii_letters + string.digits

# ---- Ticket / Access Code ----
def gen_ticket_id(length: int = 12) -> str:
    """Generate a unique ticket ID."""
    return "".join(secrets.choice(TICKET_ALPHABET) for _ in range(length))

def gen_access_code(length: int = 20) -> str:
    """Generate a secure access code."""
    return "".join(secrets.choice(CODE_ALPHABET) for _ in range(length))

def hash_code(raw: str) -> str:
    """Hash a code using Argon2."""
    return argon2.hash(raw)

def verify_code(raw: str, hashed: str) -> bool:
    """Verify a raw code against its hash."""
    try:
        return argon2.verify(raw, hashed)
    except Exception:
        return False

# ---- Token Utilities ----
def get_serializer() -> URLSafeTimedSerializer:
    """Return a configured serializer for issuing/verifying tokens."""
    return URLSafeTimedSerializer(secret_key=Config.SECRET_KEY, salt="session")

def issue_token(payload: dict) -> str:
    """
    Issue a signed token containing `payload`.
    Token expiration is verified in verify_token() with max_age parameter.
    """
    s = get_serializer()
    return s.dumps(payload)

def verify_token(token: str, max_age: int = 60*60*24*30) -> dict | None:
    """
    Verify a signed token.
    Returns the payload dict if valid, otherwise None.
    """
    s = get_serializer()
    try:
        data = s.loads(token, max_age=max_age)
        return data
    except (BadSignature, SignatureExpired):
        return None
