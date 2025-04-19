module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // 경로 alias (@/로 시작하는 거) 사용하는 경우
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
}
