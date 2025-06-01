const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/schedule.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

// Get all schedules (authenticated users)
router.get('/', authenticateToken, ScheduleController.getAllSchedules);

// Get schedule by course (authenticated users)
router.get('/course/:courseId', authenticateToken, ScheduleController.getScheduleByCourse);

// Create schedule (admin only)
router.post('/', authenticateToken, allowRoles(1), ScheduleController.createSchedule);

// Update schedule (admin only)
router.put('/:id', authenticateToken, allowRoles(1), ScheduleController.updateSchedule);

// Delete schedule (admin only)
router.delete('/:id', authenticateToken, allowRoles(1), ScheduleController.deleteSchedule);

module.exports = router;
