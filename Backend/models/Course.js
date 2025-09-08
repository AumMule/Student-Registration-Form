const db = require('../config/database');

class Course {
    // Get all courses
    static async getAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM courses ORDER BY course_name');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get course by ID
    static async getById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM courses WHERE course_id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get students in a course
    static async getStudents(courseId) {
        try {
            const [rows] = await db.execute(`
                SELECT * FROM students WHERE course_id = ? ORDER BY first_name, last_name
            `, [courseId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Course;