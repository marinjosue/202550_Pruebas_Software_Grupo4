// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route
router.post('/login', authController.login);


// Login google route
router.post('/check-google-user', authController.checkGoogleUser);
router.post('/google-login', authController.googleLogin);

module.exports = router;