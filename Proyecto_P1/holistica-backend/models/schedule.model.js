const pool = require('../config/db');

const ScheduleModel = {
    async create(schedule) {
        const { course_id, day_of_week, start_time, end_time, instructor_id } = schedule;

        const [result] = await pool.query(`
      INSERT INTO schedules (course_id, day_of_week, start_time, end_time, instructor_id)
      VALUES (?, ?, ?, ?, ?)`,
            [course_id, day_of_week, start_time, end_time, instructor_id]
        );

        return result.insertId;
    },

    async findAll() {
        const [rows] = await pool.query(`
      SELECT s.*, c.title as course_title, u.name as instructor_name
      FROM schedules s
      LEFT JOIN courses c ON s.course_id = c.id
      LEFT JOIN users u ON s.instructor_id = u.id
      ORDER BY s.day_of_week, s.start_time
    `);
        return rows;
    },

    async findByCourse(course_id) {
        const [rows] = await pool.query(`
      SELECT s.*, u.name as instructor_name
      FROM schedules s
      LEFT JOIN users u ON s.instructor_id = u.id
      WHERE s.course_id = ?
      ORDER BY s.day_of_week, s.start_time`,
            [course_id]
        );
        return rows;
    },

    async update(id, data) {
        const { day_of_week, start_time, end_time, instructor_id } = data;

        await pool.query(`
      UPDATE schedules 
      SET day_of_week = ?, start_time = ?, end_time = ?, instructor_id = ?
      WHERE id = ?`,
            [day_of_week, start_time, end_time, instructor_id, id]
        );
    },

    async delete(id) {
        await pool.query('DELETE FROM schedules WHERE id = ?', [id]);
    },

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM schedules WHERE id = ?', [id]);
        return rows[0];
    }
};

module.exports = ScheduleModel;
