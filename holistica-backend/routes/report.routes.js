const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

// All report routes are admin-only
router.use(authenticateToken);
router.use(allowRoles(1));

// Generate course reports
router.get('/courses', ReportController.generateCourseReports);

// Generate financial reports
router.get('/financial', ReportController.getFinancialReport);

module.exports = router;
