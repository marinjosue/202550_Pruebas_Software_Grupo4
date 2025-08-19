const pool = require('../config/db');

const MultimediaModel = {
  async upload(content) {
    const { course_id, title, type, url } = content;

    const [result] = await pool.query(`
      INSERT INTO contents (course_id, title, type, url)
      VALUES (?, ?, ?, ?)`,
      [course_id, title, type, url]
    );

    return result.insertId;
  },

  async findByCourse(course_id) {
    const [rows] = await pool.query(`
      SELECT * FROM contents WHERE course_id = ?`,
      [course_id]
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
