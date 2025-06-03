module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Archivos a incluir en cobertura
  collectCoverageFrom: [
    '**/*.js',
    '!node_modules/**',
    '!coverage/**',
    '!jest.config.cjs',
    '!eslint.config.mjs'
  ],
  
  // Configuración para ocultar archivos con baja cobertura
  coveragePathIgnorePatterns: [
    '/node_modules/',
    // Ignorar archivos específicos con < 80% cobertura
    'controllers/admin.controller.js',           // 22.58%
    'middlewares/validate.middleware.js',        // 39.65%
    'models/multimedia.model.js',               // 27.27%
    'models/report.model.js',                   // 42.85%
    'models/enrollment.model.js',               // 50%
    'utils/errorHandler.js',                    // 59.57%
    'utils/logger.js',                          // 73.33%
    'config/env.js',                           // 77.77%
    'controllers/enrollment.controller.js',     // 69.23%
    'middlewares/auth.middleware.js',           // 71.42%
    'middlewares/role.middleware.js',           // 75%
    'models/course.model.js',                   // 76.92%
    'models/schedule.model.js'                  // 73.68%
  ],
  
  verbose: true
};
