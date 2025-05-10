// 테스트 환경과 개발 환경을 분리하기 위한 Jest 설정
module.exports = {
  // 테스트 환경 설정 - React 컴포넌트 테스트를 위해 jsdom 사용
  testEnvironment: 'jsdom',
  
  // 테스트 파일 패턴 - 기존 패턴 유지하면서 React 컴포넌트 테스트 추가
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/src/**/*.test.[jt]s?(x)'
  ],
  
  // 트랜스폼 설정 - Next.js와 호환되도록 설정
  transform: {
    // ts-jest 대신 babel-jest 사용 (Next.js와 호환)
    '^.+\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './jest.babel.config.js' }]
  },
  
  // 파일 확장자 설정
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  
  // 모듈 경로 매핑 (제거됨 - 아래에서 통합)
  
  // 테스트 환경 설정 파일 - setupFilesAfterEnv로 변경하여 테스트 프레임워크 설정 후 로드
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // 테스트 제외 패턴
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  
  // 테스트 환경 변수 설정
  testEnvironmentOptions: {
    // Next.js 호환성을 위한 URL 설정
    url: 'http://localhost'
  },
  
  // 모듈 모킹 설정
  moduleNameMapper: {
    // Path aliases 매핑 - Next.js의 @/ alias와 일치하도록 설정
    '^@/(.*)$': '<rootDir>/src/$1',
    
    // CSS, 이미지 등 정적 파일 모킹
    '\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
    '\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
  }
}
