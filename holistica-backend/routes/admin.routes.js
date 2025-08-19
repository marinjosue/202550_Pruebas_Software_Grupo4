const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(allowRoles(1));

// Content management routes
router.post('/content/upload', AdminController.uploadContent);
router.put('/content/:id', AdminController.updateContent);
router.delete('/content/:id', AdminController.deleteContent);

// Get course content (can be accessed by enrolled users too)
router.get('/content/:courseId', AdminController.getCourseContent);

module.exports = router;
