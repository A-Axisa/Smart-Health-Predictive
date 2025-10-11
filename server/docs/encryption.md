# Encryption Utility

Location: `server/utils/encryptor.py`

## 1. Features

- AES-256-GCM
- Key env: `DATA_CIPHER_KEY` (32 bytes)
- Output: `v1:gcm:Base64(IV):Base64(Tag):Base64(Cipher)`

## 2. Generate & Set Key

```
python -m utils.encryptor gen-key
set DATA_CIPHER_KEY=<Base64String>
```

## 3. Basic Usage

```python
from utils.encryptor import encrypt, decrypt
cipher = encrypt('hello')
plain = decrypt(cipher)
```

## 4. Simple Test

```python
from utils.encryptor import encrypt, decrypt
c = encrypt('hello')
assert decrypt(c) == 'hello'
```

## 5. Notes

- Store the returned string directly in DB
- Do not re-encode
- Keep key secret / rotate if compromised
