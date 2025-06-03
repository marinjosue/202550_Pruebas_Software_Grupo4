const pool = require('../config/db');

const MultimediaModel = {
  async upload(content) {
    const { courseId, title, type, url } = content;

    const [result] = await pool.query(`
      INSERT INTO contents (course_id, title, type, url)
      VALUES (?, ?, ?, ?)`,
      [courseId, title, type, url]
    );

    return result.insertId;
  },

  async findByCourse(courseId) {
    const [rows] = await pool.query(`
      SELECT * FROM contents WHERE course_id = ?`,
      [courseId]
    );
    return rows;
  },

  async update(id, data) {
    const { title, type, url } = data;
    await pool.query(`
      UPDATE contents SET title = ?, type = ?, url = ? WHERE id = ?`,
      [title, type, url, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM contents WHERE id = ?', [id]);
  }
};

module.exports = MultimediaModel;
