import { encrypt, decrypt } from '@/shared/lib/crypto'

describe('Encryption/Decryption Utils', () => {
  it('should return the original value after encrypt and decrypt', () => {
    const raw = 'secret message'
    const encrypted = encrypt(raw)
    const decrypted = decrypt(encrypted)
    expect(decrypted).toBe(raw)
  })

  it('should throw an error for invalid ciphertext', () => {
    expect(() => decrypt('invalid-token')).toThrow()
  })
})
