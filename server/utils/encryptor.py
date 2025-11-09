"""AES-256-GCM encrypt/decrypt utility
Env: DATA_CIPHER_KEY (32 bytes, Base64 or raw 32-char utf-8)
Output: v1:gcm:base64(iv):base64(tag):base64(cipher)
"""
import os
import base64
import sys
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


def load_key():
    raw = os.getenv('DATA_CIPHER_KEY')
    if not raw:
        raise RuntimeError('Missing env DATA_CIPHER_KEY')
    try:
        if 43 <= len(raw) <= 44:
            key = base64.b64decode(raw)
        else:
            key = raw.encode('utf-8')
    except Exception:
        raise RuntimeError('Invalid key format')
    if len(key) != 32:
        raise RuntimeError(
            'DATA_CIPHER_KEY must be 32 bytes, got ' + str(len(key)))
    return key


def encrypt(plain_text):
    if plain_text is None:
        plain_text = ''
    if isinstance(plain_text, str):
        data = plain_text.encode('utf-8')
    else:
        data = plain_text
    key = load_key()
    iv = os.urandom(12)
    aes = AESGCM(key)
    ct_tag = aes.encrypt(iv, data, None)
    ct, tag = ct_tag[:-16], ct_tag[-16:]
    return ':'.join([
        'v1', 'gcm',
        base64.b64encode(iv).decode(),
        base64.b64encode(tag).decode(),
        base64.b64encode(ct).decode()
    ])


def decrypt(payload):
    if not isinstance(payload, str):
        raise RuntimeError('Cipher payload must be string')
    parts = payload.split(':')
    if len(parts) != 5 or parts[0] != 'v1' or parts[1] != 'gcm':
        raise RuntimeError('Cipher format invalid')
    _, _, iv_b64, tag_b64, ct_b64 = parts
    iv = base64.b64decode(iv_b64)
    tag = base64.b64decode(tag_b64)
    ct = base64.b64decode(ct_b64)
    if len(iv) != 12:
        raise RuntimeError('IV length invalid')
    key = load_key()
    aes = AESGCM(key)
    pt = aes.decrypt(iv, ct + tag, None)
    return pt.decode('utf-8')


if __name__ == '__main__':
    if len(sys.argv) == 2 and sys.argv[1] == 'gen-key':
        print(base64.b64encode(os.urandom(32)).decode())
    else:
        print('Usage: python -m utils.encryptor gen-key')


class EncryptionError(Exception):
    pass
