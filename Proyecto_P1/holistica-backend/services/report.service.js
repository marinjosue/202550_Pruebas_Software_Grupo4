const pool = require('../config/db');
const ReportModel = require('../models/report.model');

class ReportService {
  static async generateCourseStatistics() {
    const [stats] = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.price,
        COUNT(DISTINCT e.id) as total_enrollments,
        COUNT(DISTINCT p.id) as total_payments,
        SUM(p.amount) as total_revenue,
        COUNT(DISTINCT CASE WHEN e.status = 'completado' THEN e.id END) as completions,
        COUNT(DISTINCT CASE WHEN e.status = 'abandonado' THEN e.id END) as abandonments,
        ROUND(AVG(CASE WHEN e.status = 'completado' THEN 100 ELSE 0 END), 2) as completion_rate
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN payments p ON c.id = p.course_id
      GROUP BY c.id, c.title, c.price
      ORDER BY total_revenue DESC
    `);

    return stats;
  }

  static async getTopSellingCourses(limit = 10) {
    const [courses] = await pool.query(`
      SELECT 
        c.title,
        COUNT(p.id) as sales_count,
        SUM(p.amount) as revenue
      FROM courses c
      JOIN payments p ON c.id = p.course_id
      GROUP BY c.id, c.title
      ORDER BY sales_count DESC
      LIMIT ?
    `, [limit]);

    return courses;
  }

  static async getMostAbandonedCourses(limit = 10) {
    const [courses] = await pool.query(`
      SELECT 
        c.title,
        COUNT(e.id) as total_enrollments,
        COUNT(CASE WHEN e.status = 'abandonado' THEN 1 END) as abandonment_count,
        ROUND(
          (COUNT(CASE WHEN e.status = 'abandonado' THEN 1 END) / COUNT(e.id)) * 100, 2
        ) as abandonment_rate
      FROM courses c
      JOIN enrollments e ON c.id = e.course_id
      GROUP BY c.id, c.title
      HAVING COUNT(e.id) > 0
      ORDER BY abandonment_rate DESC
      LIMIT ?
    `, [limit]);

    return courses;
  }

  static async getRevenueAnalytics(days = 30) {
    const [revenue] = await pool.query(`
      SELECT 
        DATE(payment_date) as date,
        COUNT(id) as transactions,
        SUM(amount) as daily_revenue,
        AVG(amount) as avg_transaction
      FROM payments
      WHERE payment_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(payment_date)
      ORDER BY date DESC
    `, [days]);

    return revenue;
  }

  static async getUserEngagementReport() {
    const [engagement] = await pool.query(`
      SELECT 
        u.name,
        u.email,
        COUNT(DISTINCT e.course_id) as courses_enrolled,
        COUNT(DISTINCT CASE WHEN e.status = 'completado' THEN e.course_id END) as courses_completed,
        COUNT(DISTINCT p.id) as total_payments,
        SUM(p.amount) as total_spent
      FROM users u
      LEFT JOIN enrollments e ON u.id = e.user_id
      LEFT JOIN payments p ON u.id = p.user_id
      WHERE u.role_id = 2
      GROUP BY u.id, u.name, u.email
      ORDER BY total_spent DESC
    `);

    return engagement;
  }

  static async generateMonthlyReport() {
    const courseStats = await this.generateCourseStatistics();
    const topSelling = await this.getTopSellingCourses(5);
    const mostAbandoned = await this.getMostAbandonedCourses(5);
    const revenueData = await this.getRevenueAnalytics(30);
    const userEngagement = await this.getUserEngagementReport();

    return {
      courseStatistics: courseStats,
      topSellingCourses: topSelling,
      mostAbandonedCourses: mostAbandoned,
      revenueAnalytics: revenueData,
      userEngagement: userEngagement,
      generatedAt: new Date().toISOString()
    };
  }
}

module.exports = ReportService;
