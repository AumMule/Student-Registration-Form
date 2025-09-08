const db = require('../config/database');

class Student {
    // Get all students
    static async getAll() {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    s.student_id,
                    s.first_name,
                    s.last_name,
                    s.email,
                    s.phone,
                    s.date_of_birth,
                    s.gender,
                    s.address,
                    s.course_id,
                    c.course_name,
                    s.enrollment_date,
                    s.created_at,
                    s.updated_at
                FROM students s
                LEFT JOIN courses c ON s.course_id = c.course_id
                ORDER BY s.student_id DESC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get student by ID
    static async getById(id) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    s.*,
                    c.course_name
                FROM students s
                LEFT JOIN courses c ON s.course_id = c.course_id
                WHERE s.student_id = ?
            `, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Create new student
    static async create(studentData) {
        try {
            const {
                first_name,
                last_name,
                email,
                phone,
                date_of_birth,
                gender,
                address,
                course_id
            } = studentData;

            const [result] = await db.execute(`
                INSERT INTO students 
                (first_name, last_name, email, phone, date_of_birth, gender, address, course_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [first_name, last_name, email, phone, date_of_birth, gender, address, course_id]);

            return { id: result.insertId, ...studentData };
        } catch (error) {
            throw error;
        }
    }

    // Update student
    static async update(id, studentData) {
        try {
            const {
                first_name,
                last_name,
                email,
                phone,
                date_of_birth,
                gender,
                address,
                course_id
            } = studentData;

            const [result] = await db.execute(`
                UPDATE students 
                SET first_name = ?, last_name = ?, email = ?, phone = ?, 
                    date_of_birth = ?, gender = ?, address = ?, course_id = ?
                WHERE student_id = ?
            `, [first_name, last_name, email, phone, date_of_birth, gender, address, course_id, id]);

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Delete student
    static async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM students WHERE student_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Search students
    static async search(searchTerm) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    s.*,
                    c.course_name
                FROM students s
                LEFT JOIN courses c ON s.course_id = c.course_id
                WHERE s.first_name LIKE ? OR s.last_name LIKE ? OR s.email LIKE ?
                ORDER BY s.student_id DESC
            `, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Student;