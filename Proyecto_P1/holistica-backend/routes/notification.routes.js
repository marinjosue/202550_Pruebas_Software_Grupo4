const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

// Get unread notifications (authenticated users)
router.get('/unread', authenticateToken, NotificationController.getUnreadNotifications);

// Mark notification as read (authenticated users)
router.put('/:id/read', authenticateToken, NotificationController.markNotificationAsRead);

// Send notification (admin only)
router.post('/', authenticateToken, allowRoles(1), NotificationController.sendNotification);

module.exports = router;
