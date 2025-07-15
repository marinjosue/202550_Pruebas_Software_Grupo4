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
    'controllers/admin.controller.js',          
    'middlewares/validate.middleware.js',       
    'models/multimedia.model.js',               
    'models/report.model.js',                 
    'models/enrollment.model.js',               
    'utils/errorHandler.js',                  
    'utils/logger.js',                        
    'config/env.js',                          
    'controllers/enrollment.controller.js',    
    'middlewares/auth.middleware.js',          
    'models/course.model.js',                   
    'models/schedule.model.js'                  
  ],
  
  verbose: true
};
