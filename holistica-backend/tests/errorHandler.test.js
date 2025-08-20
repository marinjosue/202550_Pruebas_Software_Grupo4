const { AppError, notFoundHandler, globalErrorHandler } = require('../utils/errorHandler');

describe('Error Handler', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            originalUrl: '/test/route'
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();

        // Backup the original process.env
        process.env.NODE_ENV_ORIGINAL = process.env.NODE_ENV;
    });

    afterEach(() => {
        // Restore the original process.env after each test
        process.env.NODE_ENV = process.env.NODE_ENV_ORIGINAL;
    });

    test('should exist', () => {
        expect(typeof globalErrorHandler).toBe('function');
        expect(typeof notFoundHandler).toBe('function');
        expect(typeof AppError).toBe('function');
    });

    test('AppError should create an error with correct properties', () => {
        const error = new AppError('Test error', 400);
        expect(error.message).toBe('Test error');
        expect(error.statusCode).toBe(400);
        expect(error.status).toBe('fail');
        expect(error.isOperational).toBe(true);
    });

    test('AppError should set status to "error" for 500+ status codes', () => {
        const error = new AppError('Server error', 500);
        expect(error.message).toBe('Server error');
        expect(error.statusCode).toBe(500);
        expect(error.status).toBe('error');
        expect(error.isOperational).toBe(true);
    });

    test('notFoundHandler should create a 404 error and pass it to next()', () => {
        notFoundHandler(req, res, next);
        expect(next).toHaveBeenCalled();
        const error = next.mock.calls[0][0];
        expect(error instanceof AppError).toBe(true);
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('No se encontró la ruta: /test/route');
    });

    test('globalErrorHandler should send error details in development mode', () => {
        // Set environment to development
        process.env.NODE_ENV = 'development';

        const err = new AppError('Test error', 400);
        err.stack = 'Error stack';

        globalErrorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            error: err,
            message: 'Test error',
            stack: 'Error stack'
        });
    });

    test('globalErrorHandler should send simplified error in production for operational errors', () => {
        // Set environment to production
        process.env.NODE_ENV = 'production';

        const err = new AppError('Test error', 400);
        
        globalErrorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Test error'
        });
    });

    test('globalErrorHandler should send generic error in production for non-operational errors', () => {
        // Set environment to production
        process.env.NODE_ENV = 'production';

        // Mock console.error to prevent output during tests
        console.error = jest.fn();

        const err = new Error('Programming error');
        err.isOperational = false;
        
        globalErrorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Algo salió mal'
        });
        expect(console.error).toHaveBeenCalled();
    });

    test('globalErrorHandler should handle custom error types in production', () => {
        // Set environment to production
        process.env.NODE_ENV = 'production';

        // Mock console.error to prevent output during tests
        console.error = jest.fn();

        // Test different error types
        const testCases = [
            { 
                name: 'JsonWebTokenError', 
                expectedStatus: 401,
                expectedMessage: 'Token inválido. Por favor inicie sesión nuevamente'
            },
            { 
                name: 'TokenExpiredError', 
                expectedStatus: 401,
                expectedMessage: 'Su token ha expirado. Por favor inicie sesión nuevamente'
            }
        ];

        testCases.forEach(testCase => {
            const err = new Error('Test error');
            err.name = testCase.name;
            
            res.status.mockClear();
            res.json.mockClear();
            
            globalErrorHandler(err, req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(testCase.expectedStatus);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: testCase.expectedMessage
            }));
        });
    });
});
