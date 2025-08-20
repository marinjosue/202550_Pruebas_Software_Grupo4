const adminController = require('../controllers/admin.controller');
const MultimediaModel = require('../models/multimedia.model');
const CourseModel = require('../models/course.model');

// Mock the models
jest.mock('../models/multimedia.model');
jest.mock('../models/course.model');

describe('Admin Controller', () => {
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

  describe('uploadContent', () => {
    beforeEach(() => {
      req.body = {
        course_id: 1,
        title: 'Test Content',
        type: 'video',
        url: 'http://example.com/video.mp4'
      };
    });

    it('should upload content successfully', async () => {
      CourseModel.exists.mockResolvedValue(true);
      MultimediaModel.upload.mockResolvedValue(123);

      await adminController.uploadContent(req, res);

      expect(CourseModel.exists).toHaveBeenCalledWith({ _id: 1 });
      expect(MultimediaModel.upload).toHaveBeenCalledWith({
        course_id: 1,
        title: 'Test Content',
        type: 'video',
        url: 'http://example.com/video.mp4'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Contenido subido exitosamente',
        contentId: 123
      });
    });

    it('should return 400 when required data is missing', async () => {
      req.body = { course_id: 1 }; // Missing other required fields

      await adminController.uploadContent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Faltan datos requeridos'
      });
    });

    it('should return 404 when course does not exist', async () => {
      CourseModel.exists.mockResolvedValue(false);

      await adminController.uploadContent(req, res);

      expect(CourseModel.exists).toHaveBeenCalledWith({ _id: 1 });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Curso no encontrado'
      });
    });

    it('should handle upload errors', async () => {
      CourseModel.exists.mockResolvedValue(true);
      MultimediaModel.upload.mockRejectedValue(new Error('Upload failed'));

      await adminController.uploadContent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al subir contenido',
        details: 'Upload failed'
      });
    });
  });

  describe('updateContent', () => {
    beforeEach(() => {
      req.params = { id: 1 };
      req.body = {
        title: 'Updated Content',
        type: 'video',
        url: 'http://example.com/updated.mp4'
      };
    });

    it('should update content successfully', async () => {
      MultimediaModel.update.mockResolvedValue();

      await adminController.updateContent(req, res);

      expect(MultimediaModel.update).toHaveBeenCalledWith(1, {
        title: 'Updated Content',
        type: 'video',
        url: 'http://example.com/updated.mp4'
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Contenido actualizado exitosamente'
      });
    });

    it('should handle update errors', async () => {
      MultimediaModel.update.mockRejectedValue(new Error('Update failed'));

      await adminController.updateContent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al actualizar contenido',
        details: 'Update failed'
      });
    });
  });

  describe('deleteContent', () => {
    beforeEach(() => {
      req.params = { id: 1 };
    });

    it('should delete content successfully', async () => {
      MultimediaModel.delete.mockResolvedValue();

      await adminController.deleteContent(req, res);

      expect(MultimediaModel.delete).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Contenido eliminado exitosamente'
      });
    });

    it('should handle delete errors', async () => {
      MultimediaModel.delete.mockRejectedValue(new Error('Delete failed'));

      await adminController.deleteContent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al eliminar contenido',
        details: 'Delete failed'
      });
    });
  });

  describe('getCourseContent', () => {
    beforeEach(() => {
      req.params = { courseId: 1 };
    });

    it('should get course content successfully', async () => {
      const mockContent = [
        { id: 1, title: 'Content 1', type: 'video' },
        { id: 2, title: 'Content 2', type: 'document' }
      ];
      MultimediaModel.findByCourse.mockResolvedValue(mockContent);

      await adminController.getCourseContent(req, res);

      expect(MultimediaModel.findByCourse).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockContent);
    });

    it('should handle get content errors', async () => {
      MultimediaModel.findByCourse.mockRejectedValue(new Error('Database error'));

      await adminController.getCourseContent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al obtener contenido',
        details: 'Database error'
      });
    });
  });
});
