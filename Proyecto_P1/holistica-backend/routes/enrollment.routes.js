const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/enrollment.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

// Enroll in course (authenticated users)
router.post('/', authenticateToken, EnrollmentController.enrollInCourse);

// Get user enrollments (authenticated users)
router.get('/my-enrollments', authenticateToken, EnrollmentController.getUserEnrollments);


module.exports = router;
