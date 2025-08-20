const { 
  validateRegistration, 
  validateLogin, 
  validateCourse, 
  validatePayment 
} = require('../middlewares/validate.middleware');
const { ValidationError } = require('../utils/errorHandler');

describe('Validate Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();

    jest.clearAllMocks();
  });

  describe('validateRegistration', () => {
    it('should pass validation with valid data', () => {
      req.body = {
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
        dni: '12345678'
      };

      validateRegistration(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should fail validation with invalid name', () => {
      req.body = {
        name: 'J',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
        dni: '12345678'
      };

      validateRegistration(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should fail validation with invalid email', () => {
      req.body = {
        name: 'John',
        lastname: 'Doe',
        email: 'invalid-email',
        password: 'password123',
        phone: '1234567890',
        dni: '12345678'
      };

      validateRegistration(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should fail validation with short password', () => {
      req.body = {
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: '12345',
        phone: '1234567890',
        dni: '12345678'
      };

      validateRegistration(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should fail validation with invalid phone', () => {
      req.body = {
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '123',
        dni: '12345678'
      };

      validateRegistration(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should fail validation with short DNI', () => {
      req.body = {
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
        dni: '123'
      };

      validateRegistration(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should accept phone with formatting characters', () => {
      req.body = {
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '(123) 456-7890',
        dni: '12345678'
      };

      validateRegistration(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('validateLogin', () => {
    it('should pass validation with valid credentials', () => {
      req.body = {
        email: 'john@example.com',
        password: 'password123'
      };

      validateLogin(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should fail validation without email', () => {
      req.body = {
        password: 'password123'
      };

      validateLogin(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should fail validation without password', () => {
      req.body = {
        email: 'john@example.com'
      };

      validateLogin(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should fail validation without both email and password', () => {
      req.body = {};

      validateLogin(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });
  });

  describe('validateCourse', () => {
    it('should pass validation with valid course data', () => {
      req.body = {
        title: 'JavaScript Basics',
        description: 'Learn JavaScript fundamentals',
        price: 99.99,
        duration: 8,
        category: 'Programming'
      };

      validateCourse(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should fail validation with short title', () => {
      req.body = {
        title: 'JS',
        description: 'Learn JavaScript fundamentals',
        price: 99.99,
        duration: 8,
        category: 'Programming'
      };

      validateCourse(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should fail validation with short description', () => {
      req.body = {
        title: 'JavaScript Basics',
        description: 'Short',
        price: 99.99,
        duration: 8,
        category: 'Programming'
      };

      validateCourse(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should fail validation with negative price', () => {
      req.body = {
        title: 'JavaScript Basics',
        description: 'Learn JavaScript fundamentals',
        price: -10,
        duration: 8,
        category: 'Programming'
      };

      validateCourse(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should accept free course with price 0', () => {
      req.body = {
        title: 'Free JavaScript Course',
        description: 'Learn JavaScript fundamentals for free',
        price: 0,
        duration: 8,
        category: 'Programming'
      };

      validateCourse(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should fail validation with invalid duration', () => {
      req.body = {
        title: 'JavaScript Basics',
        description: 'Learn JavaScript fundamentals',
        price: 99.99,
        duration: 0,
        category: 'Programming'
      };

      validateCourse(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });
  });

  describe('validatePayment', () => {
    it('should pass validation with valid payment data', () => {
      req.body = {
        course_id: 1,
        amount: 99.99,
        method: 'stripe'
      };

      validatePayment(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should fail validation without course_id', () => {
      req.body = {
        amount: 99.99,
        method: 'stripe'
      };

      validatePayment(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should fail validation with invalid amount', () => {
      req.body = {
        course_id: 1,
        amount: 0,
        method: 'stripe'
      };

      validatePayment(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should fail validation with invalid payment method', () => {
      req.body = {
        course_id: 1,
        amount: 99.99,
        method: 'bitcoin'
      };

      validatePayment(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should accept all valid payment methods', () => {
      const validMethods = ['stripe', 'transferencia', 'efectivo'];

      validMethods.forEach(method => {
        req.body = {
          course_id: 1,
          amount: 99.99,
          method: method
        };

        next.mockClear();
        validatePayment(req, res, next);

        expect(next).toHaveBeenCalledWith();
      });
    });
  });
});
