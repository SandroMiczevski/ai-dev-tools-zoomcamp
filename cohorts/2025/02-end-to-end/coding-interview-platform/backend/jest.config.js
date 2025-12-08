module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'server.js',
    'modules/**/*.js',
  ],
  testMatch: [
    '**/__tests__/**/*.test.js',
  ],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  testTimeout: 10000,
  collectCoverage: false,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
  ],
};
