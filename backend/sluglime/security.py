import secrets
from passlib.hash import bcrypt

def gen_ticket_id(n=8):
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no 0/O/I/1
    return ''.join(secrets.choice(alphabet) for _ in range(n))

def gen_access_code():
    return f"{secrets.randbelow(1_000_000):06d}"  # 6-digit

def hash_code(code: str) -> str:
    return bcrypt.hash(code)

def verify_code(code: str, code_hash: str) -> bool:
    return bcrypt.verify(code, code_hash)