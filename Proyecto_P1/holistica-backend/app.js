const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./config/env'); // Load and validate environment variables

// Import utilities
const logger = require('./utils/logger');
const { globalErrorHandler, notFoundHandler } = require('./utils/errorHandler');
const pool = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routes');
const paymentRoutes = require('./routes/payment.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const notificationRoutes = require('./routes/notification.routes');
const reportRoutes = require('./routes/report.routes');
const adminRoutes = require('./routes/admin.routes');
const scheduleRoutes = require('./routes/schedule.routes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(logger.logRequest.bind(logger));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database health check endpoint
app.get('/health/db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.status(200).json({
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString(),
      test_query: rows[0]
    });
  } catch (error) {
    logger.error('Database health check failed', { error: error.message });
    res.status(500).json({
      status: 'ERROR',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/schedules', scheduleRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Holística Academy API',
    version: '1.0.0',
    documentation: '/api/docs',
    status: 'Running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users', 
      courses: '/api/courses',
      payments: '/api/payments',
      enrollments: '/api/enrollments',
      notifications: '/api/notifications',
      reports: '/api/reports',
      admin: '/api/admin',
      schedules: '/api/schedules'
    }
  });
});

// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

// Graceful shutdown handlers
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection', { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

module.exports = app;
