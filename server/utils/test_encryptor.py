import os
from encryptor import encrypt, decrypt


def setup_key():
    if not os.getenv("DATA_CIPHER_KEY"):
        # Deterministic key for test (32 bytes)
        os.environ["DATA_CIPHER_KEY"] = "A" * 32


def test_round_trip():
    setup_key()
    plaintext = "hello data"
    blob = encrypt(plaintext)
    assert blob.startswith("v1:gcm:")
    recovered = decrypt(blob)
    assert recovered == plaintext


if __name__ == "__main__":
    setup_key()
    test_round_trip()
    print("All tests passed")
