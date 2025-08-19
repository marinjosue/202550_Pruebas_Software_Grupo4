const pool = require('../config/db');

const CourseModel = {
  async create(course) {
    const {
      title, description, price, duration,
      category, type, start_date, end_date, created_by
    } = course;

    const [result] = await pool.query(`
      INSERT INTO courses (title, description, price, duration, category, type, start_date, end_date, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price, duration, category, type, start_date, end_date, created_by]
    );

    return result.insertId;
  },

  async findAll() {
    const [rows] = await pool.query('SELECT * FROM courses');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    return rows[0];
  },

  async update(id, data) {
    const {
      title, description, price, duration,
      category, type, start_date, end_date
    } = data;

    await pool.query(`
      UPDATE courses SET title = ?, description = ?, price = ?, duration = ?, category = ?, type = ?, start_date = ?, end_date = ?
      WHERE id = ?`,
      [title, description, price, duration, category, type, start_date, end_date, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM courses WHERE id = ?', [id]);
  }
};

module.exports = CourseModel;
