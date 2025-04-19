import { encrypt, decrypt } from '@/lib/crypto'

describe('암복호화 유틸', () => {
  it('encrypt → decrypt 결과가 원래 값과 같아야 한다', () => {
    const raw = 'secret message'
    const encrypted = encrypt(raw)
    const decrypted = decrypt(encrypted)
    expect(decrypted).toBe(raw)
  })

  it('잘못된 암호문은 복호화할 수 없어야 한다', () => {
    expect(() => decrypt('invalid-token')).toThrow()
  })
})