const ReportModel = require('../models/report.model');
const pool = require('../config/db');

// Mock the database pool
jest.mock('../config/db');

describe('Report Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generate', () => {
    it('should generate report successfully', async () => {
      const mockResult = { insertId: 123 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await ReportModel.generate(1, 50, 100, 75);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO reports'),
        [1, 50, 100, 75]
      );
      expect(result).toBe(123);
    });

    it('should handle generate database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      await expect(ReportModel.generate(1, 50, 100, 75)).rejects.toThrow('Database error');
    });

    it('should generate reports with different data', async () => {
      const mockResult = { insertId: 456 };
      pool.query.mockResolvedValue([mockResult]);

      const reportData = [
        { course_id: 1, total_sales: 50, total_enrollments: 100, total_completions: 75 },
        { course_id: 2, total_sales: 25, total_enrollments: 50, total_completions: 30 },
        { course_id: 3, total_sales: 100, total_enrollments: 200, total_completions: 150 }
      ];

      for (const data of reportData) {
        const result = await ReportModel.generate(
          data.course_id,
          data.total_sales,
          data.total_enrollments,
          data.total_completions
        );
        
        expect(pool.query).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO reports'),
          [data.course_id, data.total_sales, data.total_enrollments, data.total_completions]
        );
        expect(result).toBe(456);
      }
    });

    it('should generate report with zero values', async () => {
      const mockResult = { insertId: 789 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await ReportModel.generate(1, 0, 0, 0);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO reports'),
        [1, 0, 0, 0]
      );
      expect(result).toBe(789);
    });

    it('should generate report with high values', async () => {
      const mockResult = { insertId: 999 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await ReportModel.generate(1, 5000, 10000, 7500);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO reports'),
        [1, 5000, 10000, 7500]
      );
      expect(result).toBe(999);
    });
  });

  describe('findAll', () => {
    it('should find all reports with course titles successfully', async () => {
      const mockReports = [
        {
          id: 1,
          course_id: 1,
          total_sales: 50,
          total_enrollments: 100,
          total_completions: 75,
          generated_at: '2025-08-20T12:00:00Z',
          title: 'JavaScript Basics'
        },
        {
          id: 2,
          course_id: 2,
          total_sales: 25,
          total_enrollments: 50,
          total_completions: 30,
          generated_at: '2025-08-19T12:00:00Z',
          title: 'React Advanced'
        }
      ];

      pool.query.mockResolvedValue([mockReports]);

      const result = await ReportModel.findAll();

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('JOIN courses c ON r.course_id = c.id')
      );
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY r.generated_at DESC')
      );
      expect(result).toEqual(mockReports);
    });

    it('should return empty array when no reports exist', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await ReportModel.findAll();

      expect(result).toEqual([]);
    });

    it('should handle find all database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(ReportModel.findAll()).rejects.toThrow('Database connection failed');
    });

    it('should include course title in results', async () => {
      const mockReports = [
        {
          id: 1,
          course_id: 1,
          total_sales: 50,
          total_enrollments: 100,
          total_completions: 75,
          title: 'Python Fundamentals'
        }
      ];

      pool.query.mockResolvedValue([mockReports]);

      const result = await ReportModel.findAll();

      expect(result[0]).toHaveProperty('title');
      expect(result[0].title).toBe('Python Fundamentals');
    });

    it('should order results by generated_at DESC', async () => {
      const mockReports = [
        {
          id: 2,
          generated_at: '2025-08-20T12:00:00Z',
          title: 'Newer Course'
        },
        {
          id: 1,
          generated_at: '2025-08-19T12:00:00Z',
          title: 'Older Course'
        }
      ];

      pool.query.mockResolvedValue([mockReports]);

      const result = await ReportModel.findAll();

      // Verify that the query includes ORDER BY clause
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY r.generated_at DESC')
      );
      
      // Result should maintain the order from database
      expect(result).toEqual(mockReports);
    });
  });
});
