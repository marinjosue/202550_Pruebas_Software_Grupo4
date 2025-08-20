const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Mock fs module
jest.mock('fs');

describe('Logger Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console methods to avoid output in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods
    console.log.mockRestore();
    console.error.mockRestore();
    console.warn.mockRestore();
    console.debug.mockRestore();
  });

  describe('constructor and setup', () => {
    it('should create logs directory if it does not exist', () => {
      fs.existsSync.mockReturnValue(false);
      fs.mkdirSync.mockImplementation(() => {});
      
      // Re-require to trigger constructor
      delete require.cache[require.resolve('../utils/logger')];
      require('../utils/logger');
      
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    it('should not create logs directory if it already exists', () => {
      fs.existsSync.mockReturnValue(true);
      
      // Re-require to trigger constructor
      delete require.cache[require.resolve('../utils/logger')];
      require('../utils/logger');
      
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('info logging', () => {
    it('should write info log with message only', () => {
      fs.appendFile.mockImplementation((path, data, callback) => callback(null));
      
      const result = logger.info('Test info message');
      
      expect(fs.appendFile).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('[INFO] Test info message', {});
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('message', 'Test info message');
    });

    it('should write info log with message and data', () => {
      fs.appendFile.mockImplementation((path, data, callback) => callback(null));
      
      const testData = { userId: 123, action: 'login' };
      const result = logger.info('User action', testData);
      
      expect(console.log).toHaveBeenCalledWith('[INFO] User action', testData);
      expect(result).toHaveProperty('userId', 123);
      expect(result).toHaveProperty('action', 'login');
    });

    it('should handle file write errors', () => {
      const writeError = new Error('File write failed');
      fs.appendFile.mockImplementation((path, data, callback) => callback(writeError));
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      logger.info('Test message');
      
      expect(console.error).toHaveBeenCalledWith('Error writing to log file:', writeError);
    });
  });

  describe('error logging', () => {
    it('should write error log', () => {
      fs.appendFile.mockImplementation((path, data, callback) => callback(null));
      
      const result = logger.error('Test error message');
      
      expect(fs.appendFile).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('[ERROR] Test error message', {});
      expect(result).toHaveProperty('message', 'Test error message');
    });

    it('should write error log with data', () => {
      fs.appendFile.mockImplementation((path, data, callback) => callback(null));
      
      const errorData = { stack: 'Error stack trace', code: 500 };
      logger.error('Database error', errorData);
      
      expect(console.error).toHaveBeenCalledWith('[ERROR] Database error', errorData);
    });
  });

  describe('warn logging', () => {
    it('should write warning log', () => {
      fs.appendFile.mockImplementation((path, data, callback) => callback(null));
      
      const result = logger.warn('Test warning');
      
      expect(console.warn).toHaveBeenCalledWith('[WARN] Test warning', {});
      expect(result).toHaveProperty('message', 'Test warning');
    });
  });

  describe('debug logging', () => {
    it('should write debug log in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      fs.appendFile.mockImplementation((path, data, callback) => callback(null));
      
      const result = logger.debug('Debug message');
      
      expect(console.debug).toHaveBeenCalledWith('[DEBUG] Debug message', {});
      expect(result).toHaveProperty('message', 'Debug message');
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not write debug log in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const result = logger.debug('Debug message');
      
      expect(console.debug).not.toHaveBeenCalled();
      expect(fs.appendFile).not.toHaveBeenCalled();
      expect(result).toBeNull();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('logRequest middleware', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        method: 'GET',
        originalUrl: '/api/test',
        ip: '127.0.0.1',
        get: jest.fn().mockReturnValue('test-user-agent')
      };
      
      res = {
        statusCode: 200,
        on: jest.fn()
      };
      
      next = jest.fn();
      
      fs.appendFile.mockImplementation((path, data, callback) => callback(null));
    });

    it('should set up response listener and call next', () => {
      logger.logRequest(req, res, next);
      
      expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
      expect(next).toHaveBeenCalled();
    });

    it('should log successful request', () => {
      res.statusCode = 200;
      logger.logRequest(req, res, next);
      
      // Simulate response finish
      const finishCallback = res.on.mock.calls[0][1];
      finishCallback();
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        expect.objectContaining({
          method: 'GET',
          url: '/api/test',
          status: 200,
          ip: '127.0.0.1'
        })
      );
    });

    it('should log client error request', () => {
      res.statusCode = 404;
      logger.logRequest(req, res, next);
      
      const finishCallback = res.on.mock.calls[0][1];
      finishCallback();
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        expect.objectContaining({
          status: 404
        })
      );
    });

    it('should log server error request', () => {
      res.statusCode = 500;
      logger.logRequest(req, res, next);
      
      const finishCallback = res.on.mock.calls[0][1];
      finishCallback();
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.objectContaining({
          status: 500
        })
      );
    });

    it('should handle missing user agent', () => {
      req.get.mockReturnValue(undefined);
      res.statusCode = 200;
      
      logger.logRequest(req, res, next);
      
      const finishCallback = res.on.mock.calls[0][1];
      finishCallback();
      
      expect(console.log).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userAgent: 'unknown'
        })
      );
    });
  });

  describe('logDbOperation', () => {
    it('should log database operations in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      fs.appendFile.mockImplementation((path, data, callback) => callback(null));
      
      logger.logDbOperation('INSERT', 'users', { userId: 123 });
      
      expect(console.debug).toHaveBeenCalledWith(
        '[DEBUG] DB INSERT on users',
        { userId: 123 }
      );
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('logAuthEvent', () => {
    it('should log authentication events', () => {
      fs.appendFile.mockImplementation((path, data, callback) => callback(null));
      
      logger.logAuthEvent('LOGIN_SUCCESS', 123, { ip: '127.0.0.1' });
      
      expect(console.log).toHaveBeenCalledWith(
        '[INFO] AUTH LOGIN_SUCCESS',
        expect.objectContaining({
          userId: 123,
          ip: '127.0.0.1'
        })
      );
    });

    it('should log auth events without additional data', () => {
      fs.appendFile.mockImplementation((path, data, callback) => callback(null));
      
      logger.logAuthEvent('LOGOUT', 456);
      
      expect(console.log).toHaveBeenCalledWith(
        '[INFO] AUTH LOGOUT',
        expect.objectContaining({
          userId: 456
        })
      );
    });
  });
});
