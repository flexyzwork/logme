import { cn, generateFallbackEmail, formatError, generateOAuthState } from './utils'

describe('utils', () => {
  describe('cn', () => {
    it('should combine class names correctly', () => {
      // 기본 클래스 결합 테스트
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
      
      // 조건부 클래스 테스트
      expect(cn('text-base', { 'text-red-500': true, 'text-blue-500': false })).toBe('text-base text-red-500')
      
      // 배열 클래스 테스트
      expect(cn('text-base', ['p-2', 'm-1'])).toBe('text-base p-2 m-1')
      
      // tailwind 충돌 클래스 병합 테스트
      expect(cn('p-2', 'p-4')).toBe('p-4')
    })
  })
  
  describe('generateFallbackEmail', () => {
    it('should generate a fallback email with provider type and user ID', () => {
      const email = generateFallbackEmail('github', '12345')
      expect(email).toBe('github-12345@generated.email')
    })
    
    it('should work with different provider types', () => {
      expect(generateFallbackEmail('google', '67890')).toBe('google-67890@generated.email')
      expect(generateFallbackEmail('facebook', 'abcdef')).toBe('facebook-abcdef@generated.email')
    })
  })
  
  describe('formatError', () => {
    it('should return error message for Error instances', () => {
      const error = new Error('Test error message')
      expect(formatError(error)).toBe('Test error message')
    })
    
    it('should convert non-Error objects to string', () => {
      expect(formatError('String error')).toBe('String error')
      expect(formatError(404)).toBe('404')
      expect(formatError({ message: 'Object error' })).toBe('[object Object]')
      expect(formatError(null)).toBe('null')
      expect(formatError(undefined)).toBe('undefined')
    })
  })
  
  describe('generateOAuthState', () => {
    // UUID 모킹을 위한 설정
    const originalRandomUUID = crypto.randomUUID
    
    beforeEach(() => {
      // randomUUID 모킹
      crypto.randomUUID = jest.fn().mockReturnValue('mocked-uuid')
    })
    
    afterEach(() => {
      // 원래 함수로 복구
      crypto.randomUUID = originalRandomUUID
    })
    
    it('should generate a state string with default prefix', () => {
      const state = generateOAuthState()
      expect(state).toBe('statemocked-uuid')
      expect(crypto.randomUUID).toHaveBeenCalledTimes(1)
    })
    
    it('should use the provided prefix', () => {
      const state = generateOAuthState('custom-')
      expect(state).toBe('custom-mocked-uuid')
    })
  })
})
