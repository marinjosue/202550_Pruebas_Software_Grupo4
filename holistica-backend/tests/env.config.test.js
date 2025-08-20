describe('Environment Configuration', () => {
  let originalEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
    
    // Clear the module cache to allow re-requiring with different env vars
    delete require.cache[require.resolve('../config/env')];
    
    // Mock console.error and process.exit
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    
    // Restore console and process methods
    console.error.mockRestore();
    process.exit.mockRestore();
  });

  describe('with valid environment variables', () => {
    it('should export configuration with default values', () => {
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      process.env.MYSQL_USER = 'test_user';
      process.env.JWT_SECRET = 'test_secret';

      const config = require('../config/env');

      expect(config).toMatchObject({
        PORT: 3000,
        MYSQL_HOST: 'localhost',
        MYSQL_DB: 'test_db',
        MYSQL_USER: 'test_user',
        MYSQL_PORT: 3306,
        JWT_SECRET: 'test_secret',
        JWT_EXPIRE: '24h',
        FRONTEND_URL: 'http://localhost:3000'
      });

      expect(console.error).not.toHaveBeenCalled();
      expect(process.exit).not.toHaveBeenCalled();
    });

    it('should use custom PORT when provided', () => {
      process.env.PORT = '8080';
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      process.env.MYSQL_USER = 'test_user';
      process.env.JWT_SECRET = 'test_secret';

      const config = require('../config/env');

      expect(config.PORT).toBe('8080');
    });

    it('should use custom MYSQL_PORT when provided', () => {
      process.env.MYSQL_PORT = '3307';
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      process.env.MYSQL_USER = 'test_user';
      process.env.JWT_SECRET = 'test_secret';

      const config = require('../config/env');

      expect(config.MYSQL_PORT).toBe('3307');
    });

    it('should use custom JWT_EXPIRE when provided', () => {
      process.env.JWT_EXPIRE = '1h';
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      process.env.MYSQL_USER = 'test_user';
      process.env.JWT_SECRET = 'test_secret';

      const config = require('../config/env');

      expect(config.JWT_EXPIRE).toBe('1h');
    });

    it('should use custom FRONTEND_URL when provided', () => {
      process.env.FRONTEND_URL = 'https://example.com';
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      process.env.MYSQL_USER = 'test_user';
      process.env.JWT_SECRET = 'test_secret';

      const config = require('../config/env');

      expect(config.FRONTEND_URL).toBe('https://example.com');
    });

    it('should handle optional MYSQL_PASSWORD', () => {
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      process.env.MYSQL_USER = 'test_user';
      process.env.JWT_SECRET = 'test_secret';
      process.env.MYSQL_PASSWORD = 'password123';

      const config = require('../config/env');

      expect(config.MYSQL_PASSWORD).toBe('password123');
    });

    it('should handle undefined MYSQL_PASSWORD', () => {
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      process.env.MYSQL_USER = 'test_user';
      process.env.JWT_SECRET = 'test_secret';
      delete process.env.MYSQL_PASSWORD;

      const config = require('../config/env');

      expect(config.MYSQL_PASSWORD).toBeUndefined();
    });
  });

  describe('with missing required environment variables', () => {
    it('should exit when MYSQL_HOST is missing', () => {
      process.env.MYSQL_DB = 'test_db';
      process.env.MYSQL_USER = 'test_user';
      process.env.JWT_SECRET = 'test_secret';
      delete process.env.MYSQL_HOST;

      require('../config/env');

      expect(console.error).toHaveBeenCalledWith(
        '❌ Missing required environment variables:',
        'MYSQL_HOST'
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should exit when MYSQL_DB is missing', () => {
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_USER = 'test_user';
      process.env.JWT_SECRET = 'test_secret';
      delete process.env.MYSQL_DB;

      require('../config/env');

      expect(console.error).toHaveBeenCalledWith(
        '❌ Missing required environment variables:',
        'MYSQL_DB'
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should exit when MYSQL_USER is missing', () => {
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      process.env.JWT_SECRET = 'test_secret';
      delete process.env.MYSQL_USER;

      require('../config/env');

      expect(console.error).toHaveBeenCalledWith(
        '❌ Missing required environment variables:',
        'MYSQL_USER'
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should exit when JWT_SECRET is missing', () => {
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      process.env.MYSQL_USER = 'test_user';
      delete process.env.JWT_SECRET;

      require('../config/env');

      expect(console.error).toHaveBeenCalledWith(
        '❌ Missing required environment variables:',
        'JWT_SECRET'
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should exit with all missing variables listed', () => {
      delete process.env.MYSQL_HOST;
      delete process.env.MYSQL_DB;
      delete process.env.MYSQL_USER;
      delete process.env.JWT_SECRET;

      require('../config/env');

      expect(console.error).toHaveBeenCalledWith(
        '❌ Missing required environment variables:',
        'MYSQL_HOST, MYSQL_DB, MYSQL_USER, JWT_SECRET'
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should exit with multiple missing variables listed', () => {
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      delete process.env.MYSQL_USER;
      delete process.env.JWT_SECRET;

      require('../config/env');

      expect(console.error).toHaveBeenCalledWith(
        '❌ Missing required environment variables:',
        'MYSQL_USER, JWT_SECRET'
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('type handling', () => {
    it('should handle PORT as string from environment', () => {
      process.env.PORT = '8080';
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      process.env.MYSQL_USER = 'test_user';
      process.env.JWT_SECRET = 'test_secret';

      const config = require('../config/env');

      expect(typeof config.PORT).toBe('string');
      expect(config.PORT).toBe('8080');
    });

    it('should handle MYSQL_PORT as string from environment', () => {
      process.env.MYSQL_PORT = '3307';
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      process.env.MYSQL_USER = 'test_user';
      process.env.JWT_SECRET = 'test_secret';

      const config = require('../config/env');

      expect(typeof config.MYSQL_PORT).toBe('string');
      expect(config.MYSQL_PORT).toBe('3307');
    });

    it('should use default PORT as number when not provided', () => {
      delete process.env.PORT;
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      process.env.MYSQL_USER = 'test_user';
      process.env.JWT_SECRET = 'test_secret';

      const config = require('../config/env');

      expect(typeof config.PORT).toBe('number');
      expect(config.PORT).toBe(3000);
    });

    it('should use default MYSQL_PORT as number when not provided', () => {
      delete process.env.MYSQL_PORT;
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_DB = 'test_db';
      process.env.MYSQL_USER = 'test_user';
      process.env.JWT_SECRET = 'test_secret';

      const config = require('../config/env');

      expect(typeof config.MYSQL_PORT).toBe('number');
      expect(config.MYSQL_PORT).toBe(3306);
    });
  });
});
