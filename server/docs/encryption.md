## Encryption Utility Guide

Location: `server/src/utils/encryptor.js`

### 1. Features

- Algorithm: AES-256-GCM (confidentiality + integrity)
- Key: environment variable `DATA_CIPHER_KEY` (32 bytes)
- Output format: `v1:gcm:Base64(IV):Base64(AuthTag):Base64(CipherText)`

### 2. Generate & Set Key

```
node server/src/utils/encryptor.js gen-key
```

Set environment variable:

```
DATA_CIPHER_KEY="<Base64String>"
```

### 3. Basic Usage

```js
const { encrypt, decrypt } = require('../src/utils/encryptor')
const cipher = encrypt('Patient name: John Doe')
const plain = decrypt(cipher)
```

### 4. Database Storage

- Store the returned string directly
- Do not re-Base64 it
- For searchable fields, keep a separate normalized/plain index; only encrypt sensitive parts

### 5. Simple Test Snippet

```js
const { encrypt, decrypt } = require('../src/utils/encryptor')
const c = encrypt('hello')
console.assert(decrypt(c) === 'hello')
```
