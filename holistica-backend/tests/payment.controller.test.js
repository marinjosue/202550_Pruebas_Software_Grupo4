const paymentController = require('../controllers/payment.controller');
const PaymentModel = require('../models/payment.model');
const CourseModel = require('../models/course.model');
const EnrollmentModel = require('../models/enrollment.model');

// Mock the models
jest.mock('../models/payment.model');
jest.mock('../models/course.model');
jest.mock('../models/enrollment.model');

describe('Payment Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 1 }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe('processPayment', () => {
    beforeEach(() => {
      req.body = {
        course_id: 1,
        amount: 100,
        method: 'tarjeta'
      };
    });

    it('should process payment successfully', async () => {
      const mockCourse = {
        id: 1,
        title: 'Test Course',
        price: 100
      };
      
      CourseModel.findById.mockResolvedValue(mockCourse);
      PaymentModel.create.mockResolvedValue(123);
      EnrollmentModel.enroll.mockResolvedValue();

      await paymentController.processPayment(req, res);

      expect(CourseModel.findById).toHaveBeenCalledWith(1);
      expect(PaymentModel.create).toHaveBeenCalledWith({
        user_id: 1,
        course_id: 1,
        amount: 100,
        method: 'tarjeta'
      });
      expect(EnrollmentModel.enroll).toHaveBeenCalledWith(1, 1, 'inscrito');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Pago procesado exitosamente',
        paymentId: 123,
        courseTitle: 'Test Course'
      });
    });

    it('should return 400 for invalid payment method', async () => {
      req.body.method = 'invalid_method';

      await paymentController.processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Método de pago inválido',
        validMethods: ['transferencia', 'online', 'stripe', 'efectivo', 'paypal', 'tarjeta']
      });
    });

    it('should return 404 when course does not exist', async () => {
      CourseModel.findById.mockResolvedValue(null);

      await paymentController.processPayment(req, res);

      expect(CourseModel.findById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Curso no encontrado'
      });
    });

    it('should handle payment processing errors', async () => {
      const mockCourse = { id: 1, title: 'Test Course' };
      CourseModel.findById.mockResolvedValue(mockCourse);
      PaymentModel.create.mockRejectedValue(new Error('Payment failed'));

      await paymentController.processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al procesar pago',
        details: 'Payment failed'
      });
    });

    it('should handle enrollment errors after payment', async () => {
      const mockCourse = { id: 1, title: 'Test Course' };
      CourseModel.findById.mockResolvedValue(mockCourse);
      PaymentModel.create.mockResolvedValue(123);
      EnrollmentModel.enroll.mockRejectedValue(new Error('Enrollment failed'));

      await paymentController.processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al procesar pago',
        details: 'Enrollment failed'
      });
    });

    // Test all valid payment methods
    const validMethods = ['transferencia', 'online', 'stripe', 'efectivo', 'paypal', 'tarjeta'];
    validMethods.forEach(method => {
      it(`should accept ${method} as valid payment method`, async () => {
        req.body.method = method;
        const mockCourse = { id: 1, title: 'Test Course' };
        
        CourseModel.findById.mockResolvedValue(mockCourse);
        PaymentModel.create.mockResolvedValue(123);
        EnrollmentModel.enroll.mockResolvedValue();

        await paymentController.processPayment(req, res);

        expect(PaymentModel.create).toHaveBeenCalledWith({
          user_id: 1,
          course_id: 1,
          amount: 100,
          method: method
        });
        expect(res.status).toHaveBeenCalledWith(201);
      });
    });
  });

  describe('getPaymentHistory', () => {
    it('should get payment history successfully', async () => {
      const mockPayments = [
        { id: 1, course_id: 1, amount: 100, method: 'tarjeta' },
        { id: 2, course_id: 2, amount: 150, method: 'paypal' }
      ];
      
      PaymentModel.findByUser.mockResolvedValue(mockPayments);

      await paymentController.getPaymentHistory(req, res);

      expect(PaymentModel.findByUser).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockPayments);
    });

    it('should handle get payment history errors', async () => {
      PaymentModel.findByUser.mockRejectedValue(new Error('Database error'));

      await paymentController.getPaymentHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al obtener historial de pagos',
        details: 'Database error'
      });
    });
  });
});
