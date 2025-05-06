import crypto from 'crypto'
import { ENCRYPTION_SECRET } from '@/shared/lib/config/server'

const algorithm = 'aes-256-cbc'
const secret = ENCRYPTION_SECRET!
const ivLength = 16

if (!secret) {
  throw new Error('❌ ENCRYPTION_SECRET is not defined in environment variables.')
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(ivLength)
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secret, 'hex'), iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

export function decrypt(encrypted: string): string {
  if (!encrypted || !encrypted.includes(':')) {
    throw new Error('❌ Invalid encrypted string format.')
  }

  const [ivHex, encryptedText] = encrypted.split(':')
  if (!ivHex || !encryptedText) {
    throw new Error('❌ Missing IV or encrypted text.')
  }

  const iv = Buffer.from(ivHex, 'hex')
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secret, 'hex'), iv)
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
