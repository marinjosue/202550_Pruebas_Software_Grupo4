const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { validateRegistration, validateLogin } = require('../middlewares/validate.middleware');

// Registro con validación
router.post('/register', validateRegistration, AuthController.register);

// Login con validación
router.post('/login', validateLogin, AuthController.login);

// Logout (acepta tanto GET como POST para compatibilidad)
router.post('/logout', AuthController.logout);
router.get('/logout', AuthController.logout);


module.exports = router;
