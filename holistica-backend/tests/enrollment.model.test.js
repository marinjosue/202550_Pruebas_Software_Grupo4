const EnrollmentModel = require('../models/enrollment.model');
const pool = require('../config/db');

// Mock the database pool
jest.mock('../config/db');

describe('Enrollment Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('enroll', () => {
    it('should enroll user with default status', async () => {
      const mockResult = { insertId: 123 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await EnrollmentModel.enroll(1, 2);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO enrollments'),
        [1, 2, 'inscrito']
      );
      expect(result).toBe(123);
    });

    it('should enroll user with custom status', async () => {
      const mockResult = { insertId: 456 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await EnrollmentModel.enroll(1, 2, 'completado');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO enrollments'),
        [1, 2, 'completado']
      );
      expect(result).toBe(456);
    });

    it('should handle enrollment database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      await expect(EnrollmentModel.enroll(1, 2)).rejects.toThrow('Database error');
    });
  });

  describe('findByUser', () => {
    it('should find enrollments by user', async () => {
      const mockEnrollments = [
        { id: 1, user_id: 1, course_id: 1, status: 'inscrito', title: 'Course 1' },
        { id: 2, user_id: 1, course_id: 2, status: 'completado', title: 'Course 2' }
      ];
      pool.query.mockResolvedValue([mockEnrollments]);

      const result = await EnrollmentModel.findByUser(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT e.*, c.title FROM enrollments e'),
        [1]
      );
      expect(result).toEqual(mockEnrollments);
    });

    it('should return empty array when user has no enrollments', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await EnrollmentModel.findByUser(999);

      expect(result).toEqual([]);
    });

    it('should handle find by user database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(EnrollmentModel.findByUser(1)).rejects.toThrow('Database connection failed');
    });
  });

  describe('updateStatus', () => {
    it('should update enrollment status successfully', async () => {
      const mockResult = { affectedRows: 1 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await EnrollmentModel.updateStatus(1, 'completado');

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE enrollments SET status = ? WHERE id = ?',
        ['completado', 1]
      );
      expect(result).toBe(true);
    });

    it('should throw error when enrollment not found', async () => {
      const mockResult = { affectedRows: 0 };
      pool.query.mockResolvedValue([mockResult]);

      await expect(EnrollmentModel.updateStatus(999, 'completado'))
        .rejects.toThrow('Inscripción con ID 999 no encontrada o no se pudo actualizar.');
    });

    it('should handle update status database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));
      
      // Mock console.error to avoid output in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(EnrollmentModel.updateStatus(1, 'completado')).rejects.toThrow('Database error');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌ Error al actualizar estado de inscripción'),
        'Database error'
      );
      
      consoleSpy.mockRestore();
    });

    it('should test different status values', async () => {
      const mockResult = { affectedRows: 1 };
      pool.query.mockResolvedValue([mockResult]);

      const statuses = ['inscrito', 'completado', 'abandonado', 'en_progreso'];

      for (const status of statuses) {
        await EnrollmentModel.updateStatus(1, status);
        expect(pool.query).toHaveBeenCalledWith(
          'UPDATE enrollments SET status = ? WHERE id = ?',
          [status, 1]
        );
      }
    });
  });
});
