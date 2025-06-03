describe('Error Handler', () => {
    test('should exist', () => {
        const { globalErrorHandler, notFoundHandler } = require('../utils/errorHandler');
        expect(typeof globalErrorHandler).toBe('function');
        expect(typeof notFoundHandler).toBe('function');
    });
});
