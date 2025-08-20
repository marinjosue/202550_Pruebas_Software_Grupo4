describe('Environment Configuration', () => {
    test('should load environment variables', () => {
        const config = require('../config/env');
        expect(config).toBeDefined();
        expect(config).toHaveProperty('MYSQL_HOST');
        expect(config).toHaveProperty('JWT_SECRET');
    });
});
