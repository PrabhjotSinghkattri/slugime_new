"""
Placeholders for adding client-side or server-side encryption.
Option A (simple): encrypt body with SECRET_KEY (Fernet/AEAD) server-side.
Option B (preferred): publish org public key; encrypt in browser with WebCrypto; store ciphertext only.
"""