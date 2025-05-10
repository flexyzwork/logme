module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.ts', '**/__tests__/**/*.test.[jt]s?(x)', '**/src/**/*.test.[jt]s?(x)'],
  transform: {
    '^.+\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/']
}
