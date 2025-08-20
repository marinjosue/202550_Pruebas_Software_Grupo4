const ScheduleModel = require('../models/schedule.model');
const pool = require('../config/db');

// Mock the database pool
jest.mock('../config/db');

describe('Schedule Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create schedule successfully', async () => {
      const mockResult = { insertId: 123 };
      pool.query.mockResolvedValue([mockResult]);

      const scheduleData = {
        course_id: 1,
        day_of_week: 'Monday',
        start_time: '10:00:00',
        end_time: '12:00:00',
        instructor_id: 5
      };

      const result = await ScheduleModel.create(scheduleData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO schedules'),
        [1, 'Monday', '10:00:00', '12:00:00', 5]
      );
      expect(result).toBe(123);
    });

    it('should handle create database errors with logging', async () => {
      const dbError = new Error('Database constraint violation');
      pool.query.mockRejectedValue(dbError);
      
      // Mock console.error to avoid output in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const scheduleData = {
        course_id: 1,
        day_of_week: 'Monday',
        start_time: '10:00:00',
        end_time: '12:00:00',
        instructor_id: 5
      };

      await expect(ScheduleModel.create(scheduleData)).rejects.toThrow('Database constraint violation');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '❌ Error al crear horario en el modelo:',
        'Database constraint violation'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Detalles del error completo:',
        dbError
      );
      
      consoleSpy.mockRestore();
    });

    it('should create schedules for different days', async () => {
      const mockResult = { insertId: 456 };
      pool.query.mockResolvedValue([mockResult]);

      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

      for (const day of daysOfWeek) {
        const scheduleData = {
          course_id: 1,
          day_of_week: day,
          start_time: '10:00:00',
          end_time: '12:00:00',
          instructor_id: 5
        };

        const result = await ScheduleModel.create(scheduleData);
        
        expect(pool.query).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO schedules'),
          [1, day, '10:00:00', '12:00:00', 5]
        );
        expect(result).toBe(456);
      }
    });
  });

  describe('findAll', () => {
    it('should find all schedules with course and instructor details', async () => {
      const mockSchedules = [
        {
          id: 1,
          course_id: 1,
          day_of_week: 'Monday',
          start_time: '10:00:00',
          end_time: '12:00:00',
          instructor_id: 5,
          course_title: 'JavaScript Basics',
          instructor_name: 'John Doe'
        },
        {
          id: 2,
          course_id: 2,
          day_of_week: 'Tuesday',
          start_time: '14:00:00',
          end_time: '16:00:00',
          instructor_id: 6,
          course_title: 'React Advanced',
          instructor_name: 'Jane Smith'
        }
      ];

      pool.query.mockResolvedValue([mockSchedules]);

      const result = await ScheduleModel.findAll();

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('LEFT JOIN courses c ON s.course_id = c.id')
      );
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('LEFT JOIN users u ON s.instructor_id = u.id')
      );
      expect(result).toEqual(mockSchedules);
    });

    it('should handle find all database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(ScheduleModel.findAll()).rejects.toThrow('Database connection failed');
    });
  });

  describe('findByCourse', () => {
    it('should find schedules by course with instructor details', async () => {
      const mockSchedules = [
        {
          id: 1,
          course_id: 1,
          day_of_week: 'Monday',
          start_time: '10:00:00',
          end_time: '12:00:00',
          instructor_id: 5,
          instructor_name: 'John Doe'
        },
        {
          id: 2,
          course_id: 1,
          day_of_week: 'Wednesday',
          start_time: '10:00:00',
          end_time: '12:00:00',
          instructor_id: 5,
          instructor_name: 'John Doe'
        }
      ];

      pool.query.mockResolvedValue([mockSchedules]);

      const result = await ScheduleModel.findByCourse(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE s.course_id = ?'),
        [1]
      );
      expect(result).toEqual(mockSchedules);
    });

    it('should return empty array when course has no schedules', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await ScheduleModel.findByCourse(999);

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update schedule successfully', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      const updateData = {
        day_of_week: 'Tuesday',
        start_time: '14:00:00',
        end_time: '16:00:00',
        instructor_id: 6
      };

      await ScheduleModel.update(1, updateData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE schedules SET'),
        ['Tuesday', '14:00:00', '16:00:00', 6, 1]
      );
    });

    it('should handle update database errors', async () => {
      pool.query.mockRejectedValue(new Error('Update failed'));

      const updateData = {
        day_of_week: 'Tuesday',
        start_time: '14:00:00',
        end_time: '16:00:00',
        instructor_id: 6
      };

      await expect(ScheduleModel.update(1, updateData)).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete schedule successfully', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      await ScheduleModel.delete(1);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM schedules WHERE id = ?',
        [1]
      );
    });

    it('should handle delete database errors', async () => {
      pool.query.mockRejectedValue(new Error('Delete failed'));

      await expect(ScheduleModel.delete(1)).rejects.toThrow('Delete failed');
    });
  });

  describe('findById', () => {
    it('should find schedule by ID successfully', async () => {
      const mockSchedule = {
        id: 1,
        course_id: 1,
        day_of_week: 'Monday',
        start_time: '10:00:00',
        end_time: '12:00:00',
        instructor_id: 5
      };

      pool.query.mockResolvedValue([[mockSchedule]]);

      const result = await ScheduleModel.findById(1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM schedules WHERE id = ?',
        [1]
      );
      expect(result).toEqual(mockSchedule);
    });

    it('should return undefined when schedule not found', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await ScheduleModel.findById(999);

      expect(result).toBeUndefined();
    });

    it('should handle find by ID database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      await expect(ScheduleModel.findById(1)).rejects.toThrow('Database error');
    });
  });
});
