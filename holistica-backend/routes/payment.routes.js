const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const authenticateToken = require('../middlewares/auth.middleware');

// Process payment (authenticated users)
router.post('/', authenticateToken, PaymentController.processPayment);

// Get payment history (authenticated users)
router.get('/history', authenticateToken, PaymentController.getPaymentHistory);

module.exports = router;
