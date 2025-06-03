const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

// Get user profile (authenticated users)
router.get('/me', authenticateToken, UserController.getProfile);

// Update user profile (authenticated users)
router.put('/me', authenticateToken, UserController.updateProfile);

// Admin routes
router.get('/', authenticateToken, allowRoles(1), UserController.getAllUsers);
router.post('/', authenticateToken, allowRoles(1), UserController.createUser);
router.delete('/:id', authenticateToken, allowRoles(1), UserController.deleteUser);

module.exports = router;
