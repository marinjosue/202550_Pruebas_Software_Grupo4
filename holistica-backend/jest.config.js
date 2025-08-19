module.exports = {
  // Set test environment
  testEnvironment: 'node',
  
  // Collect coverage from all source files except node_modules
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/scripts/**'
  ],
  
  // The directories where Jest looks for tests
  roots: [
    '<rootDir>/tests'
  ],
  
  // Default test match pattern
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // Verbose output
  verbose: true
};
