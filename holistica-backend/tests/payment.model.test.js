const PaymentModel = require('../models/payment.model');
const pool = require('../config/db');

// Mock the database pool
jest.mock('../config/db');

describe('Payment Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create payment successfully', async () => {
      const mockResult = { insertId: 123 };
      pool.query.mockResolvedValue([mockResult]);

      const paymentData = {
        user_id: 1,
        course_id: 2,
        amount: 100,
        method: 'tarjeta'
      };

      const result = await PaymentModel.create(paymentData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO payments'),
        [1, 2, 100, 'tarjeta']
      );
      expect(result).toBe(123);
    });

    it('should handle create payment database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const paymentData = {
        user_id: 1,
        course_id: 2,
        amount: 100,
        method: 'paypal'
      };

      await expect(PaymentModel.create(paymentData)).rejects.toThrow('Database error');
    });

    it('should create payment with different payment methods', async () => {
      const mockResult = { insertId: 456 };
      pool.query.mockResolvedValue([mockResult]);

      const paymentMethods = ['tarjeta', 'paypal', 'transferencia', 'efectivo', 'stripe', 'online'];

      for (const method of paymentMethods) {
        const paymentData = {
          user_id: 1,
          course_id: 2,
          amount: 100,
          method: method
        };

        const result = await PaymentModel.create(paymentData);
        
        expect(pool.query).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO payments'),
          [1, 2, 100, method]
        );
        expect(result).toBe(456);
      }
    });

    it('should create payment with different amounts', async () => {
      const mockResult = { insertId: 789 };
      pool.query.mockResolvedValue([mockResult]);

      const amounts = [50, 100, 250, 500, 1000];

      for (const amount of amounts) {
        const paymentData = {
          user_id: 1,
          course_id: 2,
          amount: amount,
          method: 'tarjeta'
        };

        const result = await PaymentModel.create(paymentData);
        
        expect(pool.query).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO payments'),
          [1, 2, amount, 'tarjeta']
        );
        expect(result).toBe(789);
      }
    });
  });

  describe('findByUser', () => {
    it('should find payments by user successfully', async () => {
      const mockPayments = [
        {
          id: 1,
          user_id: 1,
          course_id: 1,
          amount: 100,
          method: 'tarjeta',
          title: 'Course 1',
          payment_date: '2025-08-20'
        },
        {
          id: 2,
          user_id: 1,
          course_id: 2,
          amount: 150,
          method: 'paypal',
          title: 'Course 2',
          payment_date: '2025-08-19'
        }
      ];

      pool.query.mockResolvedValue([mockPayments]);

      const result = await PaymentModel.findByUser(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT p.*, c.title FROM payments p'),
        [1]
      );
      expect(result).toEqual(mockPayments);
    });

    it('should return empty array when user has no payments', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await PaymentModel.findByUser(999);

      expect(result).toEqual([]);
    });

    it('should handle find by user database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(PaymentModel.findByUser(1)).rejects.toThrow('Database connection failed');
    });

    it('should include course title in results', async () => {
      const mockPayments = [
        {
          id: 1,
          user_id: 1,
          course_id: 1,
          amount: 100,
          method: 'tarjeta',
          title: 'JavaScript Fundamentals'
        }
      ];

      pool.query.mockResolvedValue([mockPayments]);

      const result = await PaymentModel.findByUser(1);

      expect(result[0]).toHaveProperty('title');
      expect(result[0].title).toBe('JavaScript Fundamentals');
    });

    it('should join with courses table', async () => {
      pool.query.mockResolvedValue([[]]);

      await PaymentModel.findByUser(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('JOIN courses c ON p.course_id = c.id'),
        [1]
      );
    });
  });
});
