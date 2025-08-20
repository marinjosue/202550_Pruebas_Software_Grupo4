const reportController = require('../controllers/report.controller');
const pool = require('../config/db');

// Mock the database pool
jest.mock('../config/db');

describe('Report Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe('generateCourseReports', () => {
    it('should generate course reports successfully', async () => {
      const mockSalesStats = [
        {
          id: 1,
          title: 'Course 1',
          total_sales: 5,
          revenue: 500,
          total_enrollments: 10,
          total_completions: 8
        },
        {
          id: 2,
          title: 'Course 2',
          total_sales: 3,
          revenue: 300,
          total_enrollments: 6,
          total_completions: 4
        }
      ];

      const mockAbandonmentStats = [
        {
          title: 'Course 1',
          abandoned_count: 2,
          total_enrollments: 10,
          abandonment_rate: 20.00
        },
        {
          title: 'Course 2',
          abandoned_count: 1,
          total_enrollments: 6,
          abandonment_rate: 16.67
        }
      ];

      pool.query
        .mockResolvedValueOnce([mockSalesStats]) // First query
        .mockResolvedValueOnce([mockAbandonmentStats]); // Second query

      await reportController.generateCourseReports(req, res);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith({
        salesAndEnrollments: mockSalesStats,
        abandonmentRates: mockAbandonmentStats
      });
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await reportController.generateCourseReports(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al generar reportes',
        details: 'Database connection failed'
      });
    });

    it('should handle empty results', async () => {
      pool.query
        .mockResolvedValueOnce([[]]) // Empty sales stats
        .mockResolvedValueOnce([[]]); // Empty abandonment stats

      await reportController.generateCourseReports(req, res);

      expect(res.json).toHaveBeenCalledWith({
        salesAndEnrollments: [],
        abandonmentRates: []
      });
    });
  });

  describe('getFinancialReport', () => {
    it('should get financial report successfully', async () => {
      const mockFinancialData = [
        {
          date: '2025-08-20',
          daily_transactions: 10,
          daily_revenue: 1000,
          avg_transaction_amount: 100
        },
        {
          date: '2025-08-19',
          daily_transactions: 8,
          daily_revenue: 800,
          avg_transaction_amount: 100
        }
      ];

      pool.query.mockResolvedValue([mockFinancialData]);

      await reportController.getFinancialReport(req, res);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('DATE(p.payment_date)'));
      expect(res.json).toHaveBeenCalledWith(mockFinancialData);
    });

    it('should handle financial report database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database query failed'));

      await reportController.getFinancialReport(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al generar reporte financiero',
        details: 'Database query failed'
      });
    });

    it('should handle empty financial data', async () => {
      pool.query.mockResolvedValue([[]]);

      await reportController.getFinancialReport(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should query data from last 30 days', async () => {
      pool.query.mockResolvedValue([[]]);

      await reportController.getFinancialReport(req, res);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DATE_SUB(NOW(), INTERVAL 30 DAY)')
      );
    });
  });
});
