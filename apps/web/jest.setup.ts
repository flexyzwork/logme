import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })

// React Testing Library 확장 매처 설정
import '@testing-library/jest-dom'

// 테스트 환경에서만 fetch 모킹 적용
if (process.env.NODE_ENV === 'test') {
  // 원본 fetch 저장
  const originalFetch = global.fetch
  
  // fetch 모킹 설정
  global.fetch = jest.fn()
  
  // 테스트 후 원복을 위한 설정
  afterAll(() => {
    if (originalFetch) {
      global.fetch = originalFetch
    }
  })
}

// 기본 타임아웃 설정
jest.setTimeout(10000)