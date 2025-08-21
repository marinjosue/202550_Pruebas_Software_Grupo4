module.exports = {
  // Set test environment
  testEnvironment: 'node',
  
  // Collect coverage from all source files except node_modules
  collectCoverageFrom: [
    'controllers/**/*.js',
    '!models/**/*.js',
    'middlewares/**/*.js',
    'services/**/*.js',
    '!utils/**/*.js',
    'config/**/*.js',
    'routes/**/*.js',
    '!admin.controller.test.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/scripts/**',
    // Archivos principales del servidor (opcional excluir)
    '!server.js',
    '!app.js',
    // Configuración de base de datos (opcional excluir)
    '!config/db.js'
  ],
  
  // Coverage thresholds - fail if below 90%
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  
  // Coverage reporting
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json'
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
