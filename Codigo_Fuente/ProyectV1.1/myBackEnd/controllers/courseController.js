// courseController.js
const pool = require('../config/db');

const courseController = {
    // Create or update course with units
    saveOrUpdateCourse: async (req, res) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const {
                id_course,
                courseName,
                courseDescription,
                start_date,
                end_date,
                price,
                cedula,
                id_category,
                status,
                course_youtube,
                unitTitles,
                unitContents
            } = req.body;

            const user_id = 1; // You might want to get this from authentication

            let courseId;
            
            if (id_course) {
                // Update existing course
                const [result] = await connection.query(
                    `UPDATE courses 
                     SET course_name = ?, course_description = ?, start_date = ?, 
                         end_date = ?, price = ?, cedula = ?, id_category = ?, 
                         status = ?, course_youtube = ?, user_id = ? 
                     WHERE id_course = ?`,
                    [courseName, courseDescription, start_date, end_date, price, 
                     cedula, id_category, status, course_youtube, user_id, id_course]
                );
                courseId = id_course;

                // Delete existing units
                await connection.query('DELETE FROM course_units WHERE id_course = ?', [courseId]);
            } else {
                // Insert new course
                const [result] = await connection.query(
                    `INSERT INTO courses (course_name, course_description, start_date, 
                                       end_date, price, cedula, id_category, status, 
                                       course_youtube, user_id)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [courseName, courseDescription, start_date, end_date, price,
                     cedula, id_category, status, course_youtube, user_id]
                );
                courseId = result.insertId;
            }

            // Insert course units
            const unitInsertQuery = 
                'INSERT INTO course_units (id_course, unit_title, unit_content) VALUES (?, ?, ?)';

            for (let i = 0; i < unitTitles.length; i++) {
                await connection.query(unitInsertQuery, [
                    courseId,
                    unitTitles[i],
                    unitContents[i]
                ]);
            }

            await connection.commit();
            res.status(200).json({ 
                message: 'Course saved successfully',
                courseId: courseId
            });

        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            res.status(500).json({ 
                message: 'Error saving course', 
                error: error.message 
            });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    // Get all courses
    getAllCourses: async (req, res) => {
        try {
            const [courses] = await pool.query('SELECT * FROM courses');
            res.json(courses);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error fetching courses', 
                error: error.message 
            });
        }
    },

    // Get course by ID with its units
    getCourseById: async (req, res) => {
        try {
            const [course] = await pool.query(
                'SELECT * FROM courses WHERE id_course = ?',
                [req.params.id]
            );

            if (course.length === 0) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const [units] = await pool.query(
                'SELECT * FROM course_units WHERE id_course = ?',
                [req.params.id]
            );

            res.json({
                ...course[0],
                units: units
            });

        } catch (error) {
            res.status(500).json({ 
                message: 'Error fetching course', 
                error: error.message 
            });
        }
    },

    // Delete course and its units
    deleteCourse: async (req, res) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            // Delete course units first (due to foreign key)
            await connection.query(
                'DELETE FROM course_units WHERE id_course = ?',
                [req.params.id]
            );

            // Delete the course
            const [result] = await connection.query(
                'DELETE FROM courses WHERE id_course = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Course not found' });
            }

            await connection.commit();
            res.json({ message: 'Course and units deleted successfully' });

        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            res.status(500).json({ 
                message: 'Error deleting course', 
                error: error.message 
            });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
};

module.exports = courseController;