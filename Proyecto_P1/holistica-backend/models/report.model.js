const pool = require('../config/db');

const ReportModel = {
  async generate(course_id, total_sales, total_enrollments, total_completions) {
    const [result] = await pool.query(`
      INSERT INTO reports (course_id, total_sales, total_enrollments, total_completions)
      VALUES (?, ?, ?, ?)`,
      [course_id, total_sales, total_enrollments, total_completions]
    );
    return result.insertId;
  },

  async findAll() {
    const [rows] = await pool.query(`
      SELECT r.*, c.title FROM reports r
      JOIN courses c ON r.course_id = c.id
      ORDER BY r.generated_at DESC
    `);
    return rows;
  }
};

module.exports = ReportModel;
