const pool = require('../config/db');

const CourseModel = {
  async create(course) {
    const {
      title, description, price, duration,
      category, type, startDate, endDate, createdBy
    } = course;

    // Las claves en el objeto JS son camelCase, pero en la consulta SQL se mantienen igual
    const [result] = await pool.query(`
      INSERT INTO courses (title, description, price, duration, category, type, start_date, end_date, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price, duration, category, type, startDate, endDate, createdBy]
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
      category, type, startDate, endDate
    } = data;

    await pool.query(`
      UPDATE courses SET title = ?, description = ?, price = ?, duration = ?, category = ?, type = ?, start_date = ?, end_date = ?
      WHERE id = ?`,
      [title, description, price, duration, category, type, startDate, endDate, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM courses WHERE id = ?', [id]);
  }
};

module.exports = CourseModel;
