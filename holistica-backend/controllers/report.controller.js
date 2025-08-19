const ReportModel = require('../models/report.model');
const pool = require('../config/db');

const generateCourseReports = async (req, res) => {
    try {
        // Get course sales and enrollment statistics
        const [salesStats] = await pool.query(`
      SELECT 
        c.id,
        c.title,
        COUNT(DISTINCT p.id) as total_sales,
        SUM(p.amount) as revenue,
        COUNT(DISTINCT e.id) as total_enrollments,
        COUNT(DISTINCT CASE WHEN e.status = 'completado' THEN e.id END) as total_completions
      FROM courses c
      LEFT JOIN payments p ON c.id = p.course_id
      LEFT JOIN enrollments e ON c.id = e.course_id
      GROUP BY c.id, c.title
      ORDER BY total_sales DESC
    `);

        // Get abandonment statistics
        const [abandonmentStats] = await pool.query(`
      SELECT 
        c.title,
        COUNT(CASE WHEN e.status = 'abandonado' THEN 1 END) as abandoned_count,
        COUNT(e.id) as total_enrollments,
        ROUND(
          (COUNT(CASE WHEN e.status = 'abandonado' THEN 1 END) / COUNT(e.id)) * 100, 2
        ) as abandonment_rate
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE e.id IS NOT NULL
      GROUP BY c.id, c.title
      ORDER BY abandonment_rate DESC
    `);

        res.json({
            salesAndEnrollments: salesStats,
            abandonmentRates: abandonmentStats
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar reportes', details: error.message });
    }
};

const getFinancialReport = async (req, res) => {
    try {
        const [financialData] = await pool.query(`
      SELECT 
        DATE(p.payment_date) as date,
        COUNT(p.id) as daily_transactions,
        SUM(p.amount) as daily_revenue,
        AVG(p.amount) as avg_transaction_amount
      FROM payments p
      WHERE p.payment_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(p.payment_date)
      ORDER BY date DESC
    `);

        res.json(financialData);
    } catch (error) {
        res.status(500).json({ error: 'Error al generar reporte financiero', details: error.message });
    }
};

module.exports = {
    generateCourseReports,
    getFinancialReport
};
