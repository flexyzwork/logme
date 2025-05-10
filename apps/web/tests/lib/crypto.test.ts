import { encrypt, decrypt } from '@/shared/lib/crypto'

describe('Encryption/Decryption Utils', () => {
  it('should return the original value after encrypt and decrypt', () => {
    const raw = 'secret message'
    const encrypted = encrypt(raw)
    const decrypted = decrypt(encrypted)
    expect(decrypted).toBe(raw)
  })

  it('should throw an error for invalid ciphertext', () => {
    expect(() => decrypt('invalid-token')).toThrow('\u274c Invalid encrypted string format.')
  })

  it('should throw an error when encrypted string is missing IV or encrypted text', () => {
    // 잘못된 형식의 암호화 문자열 (콜론은 있지만 IV나 암호화된 텍스트가 없음)
    expect(() => decrypt('abc:')).toThrow('\u274c Missing IV or encrypted text.')
    expect(() => decrypt(':xyz')).toThrow('\u274c Missing IV or encrypted text.')
  })

  it('should encrypt different values with different IVs', () => {
    const raw = 'test message'
    const encrypted1 = encrypt(raw)
    const encrypted2 = encrypt(raw)
    
    // 두 값이 다르게 암호화되어야 함 (다른 IV 사용)
    expect(encrypted1).not.toBe(encrypted2)
    
    // 하지만 복호화하면 같은 값이 나와야 함
    expect(decrypt(encrypted1)).toBe(raw)
    expect(decrypt(encrypted2)).toBe(raw)
  })

  it('should handle empty strings', () => {
    const raw = ''
    const encrypted = encrypt(raw)
    const decrypted = decrypt(encrypted)
    expect(decrypted).toBe(raw)
  })
})
