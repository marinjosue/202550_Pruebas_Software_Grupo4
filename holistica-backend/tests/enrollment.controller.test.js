const enrollmentController = require('../controllers/enrollment.controller');
const EnrollmentModel = require('../models/enrollment.model');
const CourseModel = require('../models/course.model');

// Mock the models
jest.mock('../models/enrollment.model');
jest.mock('../models/course.model');

describe('Enrollment Controller', () => {
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

  describe('enrollInCourse', () => {
    beforeEach(() => {
      req.body = { course_id: 1 };
    });

    it('should enroll user in course successfully', async () => {
      const mockCourse = {
        id: 1,
        title: 'Test Course',
        description: 'Test Description'
      };
      
      CourseModel.findById.mockResolvedValue(mockCourse);
      EnrollmentModel.enroll.mockResolvedValue(123);

      await enrollmentController.enrollInCourse(req, res);

      expect(CourseModel.findById).toHaveBeenCalledWith(1);
      expect(EnrollmentModel.enroll).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Inscripción exitosa',
        enrollmentId: 123,
        courseTitle: 'Test Course'
      });
    });

    it('should return 404 when course does not exist', async () => {
      CourseModel.findById.mockResolvedValue(null);

      await enrollmentController.enrollInCourse(req, res);

      expect(CourseModel.findById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Curso no encontrado'
      });
    });

    it('should handle enrollment errors', async () => {
      const mockCourse = { id: 1, title: 'Test Course' };
      CourseModel.findById.mockResolvedValue(mockCourse);
      EnrollmentModel.enroll.mockRejectedValue(new Error('Already enrolled'));

      await enrollmentController.enrollInCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al inscribirse',
        details: 'Already enrolled'
      });
    });
  });

  describe('getUserEnrollments', () => {
    it('should get user enrollments successfully', async () => {
      const mockEnrollments = [
        { id: 1, course_id: 1, course_title: 'Course 1' },
        { id: 2, course_id: 2, course_title: 'Course 2' }
      ];
      
      EnrollmentModel.findByUser.mockResolvedValue(mockEnrollments);

      await enrollmentController.getUserEnrollments(req, res);

      expect(EnrollmentModel.findByUser).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockEnrollments);
    });

    it('should handle get enrollments errors', async () => {
      EnrollmentModel.findByUser.mockRejectedValue(new Error('Database error'));

      await enrollmentController.getUserEnrollments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al obtener inscripciones',
        details: 'Database error'
      });
    });
  });
});
