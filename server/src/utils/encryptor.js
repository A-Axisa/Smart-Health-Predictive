// AES-256-GCM encrypt/decrypt utility
// Environment variable: DATA_CIPHER_KEY (32 bytes, either Base64 or raw UTF-8 length 32)

const crypto = require('crypto')

function loadKey() {
  const raw = process.env.DATA_CIPHER_KEY
  if (!raw) throw new Error('Missing env DATA_CIPHER_KEY')
  let key
  if (/^[A-Za-z0-9+/=]{43,44}$/.test(raw)) {
    key = Buffer.from(raw, 'base64')
  } else {
    key = Buffer.from(raw, 'utf8')
  }
  if (key.length !== 32) throw new Error('DATA_CIPHER_KEY must be 32 bytes, got ' + key.length)
  return key
}

// encrypt: returns string format v1:gcm:base64(iv):base64(tag):base64(cipher)
function encrypt(plainText) {
  if (plainText == null) plainText = ''
  const key = loadKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const enc = Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return ['v1', 'gcm', iv.toString('base64'), tag.toString('base64'), enc.toString('base64')].join(':')
}

function decrypt(payload) {
  if (typeof payload !== 'string') throw new Error('Cipher payload must be string')
  const parts = payload.split(':')
  if (parts.length !== 5 || parts[0] !== 'v1' || parts[1] !== 'gcm') throw new Error('Cipher format invalid')
  const [, , ivB64, tagB64, dataB64] = parts
  const key = loadKey()
  const iv = Buffer.from(ivB64, 'base64')
  const tag = Buffer.from(tagB64, 'base64')
  const data = Buffer.from(dataB64, 'base64')
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  const dec = Buffer.concat([decipher.update(data), decipher.final()])
  return dec.toString('utf8')
}

module.exports = { encrypt, decrypt }

// CLI helper: generate random key
if (require.main === module) {
  if (process.argv[2] === 'gen-key') {
    console.log(crypto.randomBytes(32).toString('base64'))
  }
}
