const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/course.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

// Public routes
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);

// Admin routes
router.post('/', authenticateToken, allowRoles(1), CourseController.createCourse);
router.put('/:id', authenticateToken, allowRoles(1), CourseController.updateCourse);
router.delete('/:id', authenticateToken, allowRoles(1), CourseController.deleteCourse);

module.exports = router;
