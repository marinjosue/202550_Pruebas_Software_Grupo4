const scheduleController = require('../controllers/schedule.controller');
const ScheduleModel = require('../models/schedule.model');

// Mock the model
jest.mock('../models/schedule.model');

describe('Schedule Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe('getAllSchedules', () => {
    it('should get all schedules successfully', async () => {
      const mockSchedules = [
        { id: 1, course_id: 1, day: 'Monday', time: '10:00' },
        { id: 2, course_id: 2, day: 'Tuesday', time: '14:00' }
      ];
      
      ScheduleModel.findAll.mockResolvedValue(mockSchedules);

      await scheduleController.getAllSchedules(req, res);

      expect(ScheduleModel.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockSchedules);
    });

    it('should handle get all schedules errors', async () => {
      ScheduleModel.findAll.mockRejectedValue(new Error('Database error'));

      await scheduleController.getAllSchedules(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al obtener horarios',
        details: 'Database error'
      });
    });
  });

  describe('getScheduleByCourse', () => {
    beforeEach(() => {
      req.params = { courseId: 1 };
    });

    it('should get schedule by course successfully', async () => {
      const mockSchedules = [
        { id: 1, course_id: 1, day: 'Monday', time: '10:00' },
        { id: 2, course_id: 1, day: 'Wednesday', time: '10:00' }
      ];
      
      ScheduleModel.findByCourse.mockResolvedValue(mockSchedules);

      await scheduleController.getScheduleByCourse(req, res);

      expect(ScheduleModel.findByCourse).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockSchedules);
    });

    it('should handle get schedule by course errors', async () => {
      ScheduleModel.findByCourse.mockRejectedValue(new Error('Course not found'));

      await scheduleController.getScheduleByCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al obtener horarios del curso',
        details: 'Course not found'
      });
    });
  });

  describe('createSchedule', () => {
    beforeEach(() => {
      req.body = {
        course_id: 1,
        day: 'Monday',
        time: '10:00',
        duration: 60
      };
    });

    it('should create schedule successfully', async () => {
      ScheduleModel.create.mockResolvedValue(123);

      await scheduleController.createSchedule(req, res);

      expect(ScheduleModel.create).toHaveBeenCalledWith({
        course_id: 1,
        day: 'Monday',
        time: '10:00',
        duration: 60
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Horario creado exitosamente',
        scheduleId: 123
      });
    });

    it('should handle create schedule errors', async () => {
      ScheduleModel.create.mockRejectedValue(new Error('Validation error'));

      await scheduleController.createSchedule(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al crear horario',
        details: 'Validation error'
      });
    });
  });

  describe('updateSchedule', () => {
    beforeEach(() => {
      req.params = { id: 1 };
      req.body = {
        day: 'Tuesday',
        time: '14:00',
        duration: 90
      };
    });

    it('should update schedule successfully', async () => {
      ScheduleModel.update.mockResolvedValue();

      await scheduleController.updateSchedule(req, res);

      expect(ScheduleModel.update).toHaveBeenCalledWith(1, {
        day: 'Tuesday',
        time: '14:00',
        duration: 90
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Horario actualizado exitosamente'
      });
    });

    it('should handle update schedule errors', async () => {
      ScheduleModel.update.mockRejectedValue(new Error('Schedule not found'));

      await scheduleController.updateSchedule(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al actualizar horario',
        details: 'Schedule not found'
      });
    });
  });

  describe('deleteSchedule', () => {
    beforeEach(() => {
      req.params = { id: 1 };
    });

    it('should delete schedule successfully', async () => {
      ScheduleModel.delete.mockResolvedValue();

      await scheduleController.deleteSchedule(req, res);

      expect(ScheduleModel.delete).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Horario eliminado exitosamente'
      });
    });

    it('should handle delete schedule errors', async () => {
      ScheduleModel.delete.mockRejectedValue(new Error('Schedule not found'));

      await scheduleController.deleteSchedule(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al eliminar horario',
        details: 'Schedule not found'
      });
    });
  });
});
