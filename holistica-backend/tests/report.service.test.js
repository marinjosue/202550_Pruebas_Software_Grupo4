const ReportService = require('../services/report.service');
const pool = require('../config/db');

// Mock the database pool
jest.mock('../config/db');

describe('Report Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCourseStatistics', () => {
    it('should generate course statistics successfully', async () => {
      const mockStats = [
        {
          id: 1,
          title: 'JavaScript Course',
          price: 99.99,
          total_enrollments: 50,
          total_payments: 45,
          total_revenue: 4499.55,
          completions: 30,
          abandonments: 5,
          completion_rate: 60.00
        }
      ];

      pool.query.mockResolvedValue([mockStats]);

      const result = await ReportService.generateCourseStatistics();

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
      expect(result).toEqual(mockStats);
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      await expect(ReportService.generateCourseStatistics())
        .rejects.toThrow('Database error');
    });
  });

  describe('getTopSellingCourses', () => {
    it('should get top selling courses with default limit', async () => {
      const mockCourses = [
        { title: 'React Course', sales_count: 100, revenue: 9999 },
        { title: 'Vue Course', sales_count: 80, revenue: 8000 }
      ];

      pool.query.mockResolvedValue([mockCourses]);

      const result = await ReportService.getTopSellingCourses();

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT ?'),
        [10]
      );
      expect(result).toEqual(mockCourses);
    });

    it('should get top selling courses with custom limit', async () => {
      const mockCourses = [
        { title: 'Angular Course', sales_count: 75, revenue: 7500 }
      ];

      pool.query.mockResolvedValue([mockCourses]);

      const result = await ReportService.getTopSellingCourses(5);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT ?'),
        [5]
      );
      expect(result).toEqual(mockCourses);
    });
  });

  describe('getMostAbandonedCourses', () => {
    it('should get most abandoned courses successfully', async () => {
      const mockCourses = [
        {
          title: 'Difficult Course',
          total_enrollments: 100,
          abandonment_count: 30,
          abandonment_rate: 30.00
        }
      ];

      pool.query.mockResolvedValue([mockCourses]);

      const result = await ReportService.getMostAbandonedCourses();

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('abandonment_rate DESC'),
        [10]
      );
      expect(result).toEqual(mockCourses);
    });

    it('should get most abandoned courses with custom limit', async () => {
      pool.query.mockResolvedValue([[]]);

      await ReportService.getMostAbandonedCourses(3);

      expect(pool.query).toHaveBeenCalledWith(
        expect.anything(),
        [3]
      );
    });
  });

  describe('getRevenueAnalytics', () => {
    it('should get revenue analytics with default days', async () => {
      const mockRevenue = [
        {
          date: '2025-08-20',
          transactions: 10,
          daily_revenue: 1000,
          avg_transaction: 100
        }
      ];

      pool.query.mockResolvedValue([mockRevenue]);

      const result = await ReportService.getRevenueAnalytics();

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INTERVAL ? DAY'),
        [30]
      );
      expect(result).toEqual(mockRevenue);
    });

    it('should get revenue analytics with custom days', async () => {
      pool.query.mockResolvedValue([[]]);

      await ReportService.getRevenueAnalytics(7);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INTERVAL ? DAY'),
        [7]
      );
    });
  });

  describe('getUserEngagementReport', () => {
    it('should get user engagement report successfully', async () => {
      const mockEngagement = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          courses_enrolled: 5,
          courses_completed: 3,
          total_payments: 4,
          total_spent: 400
        }
      ];

      pool.query.mockResolvedValue([mockEngagement]);

      const result = await ReportService.getUserEngagementReport();

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('role_id = 2'));
      expect(result).toEqual(mockEngagement);
    });
  });

  describe('generateMonthlyReport', () => {
    it('should generate complete monthly report', async () => {
      const mockCourseStats = [{ id: 1, title: 'Course 1' }];
      const mockTopSelling = [{ title: 'Popular Course' }];
      const mockAbandoned = [{ title: 'Hard Course' }];
      const mockRevenue = [{ date: '2025-08-20', revenue: 1000 }];
      const mockEngagement = [{ name: 'John', email: 'john@example.com' }];

      pool.query
        .mockResolvedValueOnce([mockCourseStats])
        .mockResolvedValueOnce([mockTopSelling])
        .mockResolvedValueOnce([mockAbandoned])
        .mockResolvedValueOnce([mockRevenue])
        .mockResolvedValueOnce([mockEngagement]);

      const result = await ReportService.generateMonthlyReport();

      expect(result).toHaveProperty('courseStatistics', mockCourseStats);
      expect(result).toHaveProperty('topSellingCourses', mockTopSelling);
      expect(result).toHaveProperty('mostAbandonedCourses', mockAbandoned);
      expect(result).toHaveProperty('revenueAnalytics', mockRevenue);
      expect(result).toHaveProperty('userEngagement', mockEngagement);
      expect(result).toHaveProperty('generatedAt');
      expect(new Date(result.generatedAt)).toBeInstanceOf(Date);
    });

    it('should handle errors in monthly report generation', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(ReportService.generateMonthlyReport())
        .rejects.toThrow('Database connection failed');
    });

    it('should call all required methods', async () => {
      // Mock all methods
      const generateCourseStatisticsSpy = jest.spyOn(ReportService, 'generateCourseStatistics')
        .mockResolvedValue([]);
      const getTopSellingCoursesSpy = jest.spyOn(ReportService, 'getTopSellingCourses')
        .mockResolvedValue([]);
      const getMostAbandonedCoursesSpy = jest.spyOn(ReportService, 'getMostAbandonedCourses')
        .mockResolvedValue([]);
      const getRevenueAnalyticsSpy = jest.spyOn(ReportService, 'getRevenueAnalytics')
        .mockResolvedValue([]);
      const getUserEngagementReportSpy = jest.spyOn(ReportService, 'getUserEngagementReport')
        .mockResolvedValue([]);

      await ReportService.generateMonthlyReport();

      expect(generateCourseStatisticsSpy).toHaveBeenCalled();
      expect(getTopSellingCoursesSpy).toHaveBeenCalledWith(5);
      expect(getMostAbandonedCoursesSpy).toHaveBeenCalledWith(5);
      expect(getRevenueAnalyticsSpy).toHaveBeenCalledWith(30);
      expect(getUserEngagementReportSpy).toHaveBeenCalled();

      // Restore spies
      generateCourseStatisticsSpy.mockRestore();
      getTopSellingCoursesSpy.mockRestore();
      getMostAbandonedCoursesSpy.mockRestore();
      getRevenueAnalyticsSpy.mockRestore();
      getUserEngagementReportSpy.mockRestore();
    });
  });
});
