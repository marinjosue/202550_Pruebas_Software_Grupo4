// courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Get all courses
router.get('/', courseController.getAllCourses);

// Get course by ID with its units
router.get('/:id', courseController.getCourseById);

// Create or update course with units
router.post('/save', courseController.saveOrUpdateCourse);

// Delete course and its units
router.delete('/:id', courseController.deleteCourse);

module.exports = router;