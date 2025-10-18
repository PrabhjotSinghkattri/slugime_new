import os, secrets, string
from passlib.hash import argon2

TICKET_ALPHABET = string.ascii_uppercase + string.digits
CODE_ALPHABET = string.ascii_letters + string.digits

def gen_ticket_id(length: int = 12) -> str:
    return "".join(secrets.choice(TICKET_ALPHABET) for _ in range(length))

def gen_access_code(length: int = 20) -> str:
    return "".join(secrets.choice(CODE_ALPHABET) for _ in range(length))

def hash_code(raw: str) -> str:
    # Argon2; you can tune parameters via env if needed
    return argon2.hash(raw)

def verify_code(raw: str, hashed: str) -> bool:
    try:
        return argon2.verify(raw, hashed)
    except Exception:
        return False
