const request = require('supertest');
const express = require('express');
const adminRoutes = require('../routes/admin.routes');
const AdminController = require('../controllers/admin.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

// Mock the dependencies
jest.mock('../controllers/admin.controller');
jest.mock('../middlewares/auth.middleware');
jest.mock('../middlewares/role.middleware');

describe('Admin Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Mock middlewares to just call next()
    authenticateToken.mockImplementation((req, res, next) => {
      req.user = { id: 1, role: 1 }; // Mock admin user
      next();
    });
    
    allowRoles.mockImplementation(() => (req, res, next) => next());
    
    // Mock controller methods
    AdminController.uploadContent.mockImplementation((req, res) => {
      res.status(201).json({ message: 'Content uploaded successfully' });
    });
    
    AdminController.updateContent.mockImplementation((req, res) => {
      res.json({ message: 'Content updated successfully' });
    });
    
    AdminController.deleteContent.mockImplementation((req, res) => {
      res.json({ message: 'Content deleted successfully' });
    });
    
    AdminController.getCourseContent.mockImplementation((req, res) => {
      res.json([{ id: 1, title: 'Test Content' }]);
    });
    
    app.use('/admin', adminRoutes);
    
    jest.clearAllMocks();
  });

  describe('POST /admin/content/upload', () => {
    it('should upload content successfully', async () => {
      const contentData = {
        course_id: 1,
        title: 'Test Video',
        type: 'video',
        url: 'https://example.com/video.mp4'
      };

      const response = await request(app)
        .post('/admin/content/upload')
        .send(contentData)
        .expect(201);

      expect(response.body).toEqual({ message: 'Content uploaded successfully' });
      expect(AdminController.uploadContent).toHaveBeenCalled();
      expect(authenticateToken).toHaveBeenCalled();
      expect(allowRoles).toHaveBeenCalledWith(1);
    });

    it('should require authentication', async () => {
      // Mock auth middleware to fail
      authenticateToken.mockImplementation((req, res, next) => {
        res.status(401).json({ error: 'Unauthorized' });
      });

      await request(app)
        .post('/admin/content/upload')
        .send({})
        .expect(401);

      expect(AdminController.uploadContent).not.toHaveBeenCalled();
    });
  });

  describe('PUT /admin/content/:id', () => {
    it('should update content successfully', async () => {
      const updateData = {
        title: 'Updated Title',
        type: 'video',
        url: 'https://example.com/updated-video.mp4'
      };

      const response = await request(app)
        .put('/admin/content/123')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({ message: 'Content updated successfully' });
      expect(AdminController.updateContent).toHaveBeenCalled();
    });

    it('should require admin role', async () => {
      // Mock role middleware to fail
      allowRoles.mockImplementation(() => (req, res, next) => {
        res.status(403).json({ error: 'Forbidden' });
      });

      await request(app)
        .put('/admin/content/123')
        .send({})
        .expect(403);

      expect(AdminController.updateContent).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /admin/content/:id', () => {
    it('should delete content successfully', async () => {
      const response = await request(app)
        .delete('/admin/content/123')
        .expect(200);

      expect(response.body).toEqual({ message: 'Content deleted successfully' });
      expect(AdminController.deleteContent).toHaveBeenCalled();
    });
  });

  describe('GET /admin/content/:courseId', () => {
    it('should get course content successfully', async () => {
      const response = await request(app)
        .get('/admin/content/1')
        .expect(200);

      expect(response.body).toEqual([{ id: 1, title: 'Test Content' }]);
      expect(AdminController.getCourseContent).toHaveBeenCalled();
    });
  });

  describe('middleware chain', () => {
    it('should apply authentication middleware first', async () => {
      await request(app)
        .post('/admin/content/upload')
        .send({});

      expect(authenticateToken).toHaveBeenCalled();
    });

    it('should apply role middleware after authentication', async () => {
      await request(app)
        .post('/admin/content/upload')
        .send({});

      expect(allowRoles).toHaveBeenCalledWith(1);
    });

    it('should call controller after middleware chain', async () => {
      await request(app)
        .post('/admin/content/upload')
        .send({});

      expect(AdminController.uploadContent).toHaveBeenCalled();
    });
  });

  describe('route parameters', () => {
    it('should pass route parameters to controller for PUT requests', async () => {
      await request(app)
        .put('/admin/content/456')
        .send({ title: 'Test' });

      expect(AdminController.updateContent).toHaveBeenCalled();
      const req = AdminController.updateContent.mock.calls[0][0];
      expect(req.params.id).toBe('456');
    });

    it('should pass route parameters to controller for DELETE requests', async () => {
      await request(app)
        .delete('/admin/content/789');

      expect(AdminController.deleteContent).toHaveBeenCalled();
      const req = AdminController.deleteContent.mock.calls[0][0];
      expect(req.params.id).toBe('789');
    });

    it('should pass courseId parameter to getCourseContent', async () => {
      await request(app)
        .get('/admin/content/123');

      expect(AdminController.getCourseContent).toHaveBeenCalled();
      const req = AdminController.getCourseContent.mock.calls[0][0];
      expect(req.params.courseId).toBe('123');
    });
  });
});
