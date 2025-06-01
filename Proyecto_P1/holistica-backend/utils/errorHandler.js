const logger = require('./logger');

class ErrorHandler extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ErrorHandler {
  constructor(message, field = null) {
    super(message, 400);
    this.field = field;
    this.type = 'ValidationError';
  }
}

class AuthenticationError extends ErrorHandler {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.type = 'AuthenticationError';
  }
}

class AuthorizationError extends ErrorHandler {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.type = 'AuthorizationError';
  }
}

class NotFoundError extends ErrorHandler {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.type = 'NotFoundError';
  }
}

class DatabaseError extends ErrorHandler {
  constructor(message = 'Database operation failed') {
    super(message, 500);
    this.type = 'DatabaseError';
  }
}

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new NotFoundError(message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ValidationError(message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ValidationError(message.join(', '));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new AuthenticationError('Token expired');
  }

  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    error = new ValidationError('Duplicate entry');
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    error = new ValidationError('Referenced resource does not exist');
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || 'Server Error',
      type: error.type || 'ServerError',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl}`);
  next(error);
};

module.exports = {
  ErrorHandler,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseError,
  globalErrorHandler,
  asyncHandler,
  notFoundHandler
};
