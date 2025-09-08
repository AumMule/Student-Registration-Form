"# Student-Registration-Form" 

### MySQL Commands For Creating Database 

-- Create Database
CREATE DATABASE IF NOT EXISTS student_registration_system;
USE student_registration_system;

-- Create Courses Table
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Students Table
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    address TEXT,
    course_id INT,
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_email (email),
    INDEX idx_course (course_id),
    INDEX idx_name (first_name, last_name)
);

-- Insert Sample Courses
INSERT INTO courses (course_name, description) VALUES
('Computer Science', 'Bachelor of Science in Computer Science - Focus on software development, algorithms, and system design'),
('Business Administration', 'Bachelor of Business Administration - Comprehensive business management and leadership program'),
('Engineering', 'Bachelor of Engineering - Mechanical, Electrical, and Civil Engineering disciplines'),
('Medicine', 'Bachelor of Medicine - Pre-medical and medical sciences program'),
('Arts', 'Bachelor of Arts - Liberal arts education with various specializations'),
('Information Technology', 'Bachelor of Science in Information Technology - IT infrastructure and management'),
('Psychology', 'Bachelor of Science in Psychology - Human behavior and mental processes'),
('Marketing', 'Bachelor of Science in Marketing - Digital and traditional marketing strategies'),
('Data Science', 'Bachelor of Science in Data Science - Big data analytics and machine learning'),
('Nursing', 'Bachelor of Science in Nursing - Healthcare and patient care management');

-- Insert Sample Students
INSERT INTO students (first_name, last_name, email, phone, date_of_birth, gender, address, course_id) VALUES
('John', 'Doe', 'john.doe@email.com', '1234567890', '2000-05-15', 'Male', '123 Main St, City, State 12345', 1),
('Jane', 'Smith', 'jane.smith@email.com', '9876543210', '2001-08-22', 'Female', '456 Oak Ave, Town, State 54321', 2),
('Michael', 'Johnson', 'michael.j@email.com', '5551234567', '1999-12-10', 'Male', '789 Pine Rd, Village, State 67890', 1),
('Emily', 'Brown', 'emily.brown@email.com', '5559876543', '2002-03-28', 'Female', '321 Elm St, City, State 13579', 3);

-- Create Views for Better Data Access
CREATE VIEW student_course_view AS
SELECT 
    s.student_id,
    s.first_name,
    s.last_name,
    s.email,
    s.phone,
    s.date_of_birth,
    s.gender,
    s.address,
    s.enrollment_date,
    c.course_id,
    c.course_name,
    c.description as course_description
FROM students s
LEFT JOIN courses c ON s.course_id = c.course_id;

-- Create Stored Procedures for CRUD Operations
DELIMITER //

-- Procedure to Add New Student
CREATE PROCEDURE AddStudent(
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_date_of_birth DATE,
    IN p_gender ENUM('Male', 'Female', 'Other'),
    IN p_address TEXT,
    IN p_course_id INT
)
BEGIN
    INSERT INTO students (first_name, last_name, email, phone, date_of_birth, gender, address, course_id)
    VALUES (p_first_name, p_last_name, p_email, p_phone, p_date_of_birth, p_gender, p_address, p_course_id);
    
    SELECT LAST_INSERT_ID() as student_id;
END //

-- Procedure to Update Student
CREATE PROCEDURE UpdateStudent(
    IN p_student_id INT,
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_date_of_birth DATE,
    IN p_gender ENUM('Male', 'Female', 'Other'),
    IN p_address TEXT,
    IN p_course_id INT
)
BEGIN
    UPDATE students 
    SET 
        first_name = p_first_name,
        last_name = p_last_name,
        email = p_email,
        phone = p_phone,
        date_of_birth = p_date_of_birth,
        gender = p_gender,
        address = p_address,
        course_id = p_course_id
    WHERE student_id = p_student_id;
END //

-- Procedure to Delete Student
CREATE PROCEDURE DeleteStudent(IN p_student_id INT)
BEGIN
    DELETE FROM students WHERE student_id = p_student_id;
END //

-- Procedure to Get Student by ID
CREATE PROCEDURE GetStudentById(IN p_student_id INT)
BEGIN
    SELECT * FROM student_course_view WHERE student_id = p_student_id;
END //

-- Procedure to Get All Students
CREATE PROCEDURE GetAllStudents()
BEGIN
    SELECT * FROM student_course_view ORDER BY student_id DESC;
END //

-- Procedure to Search Students
CREATE PROCEDURE SearchStudents(IN search_term VARCHAR(100))
BEGIN
    SELECT * FROM student_course_view 
    WHERE first_name LIKE CONCAT('%', search_term, '%')
       OR last_name LIKE CONCAT('%', search_term, '%')
       OR email LIKE CONCAT('%', search_term, '%')
    ORDER BY student_id DESC;
END //

DELIMITER ;

-- Create Indexes for Performance
CREATE INDEX idx_student_name ON students(first_name, last_name);
CREATE INDEX idx_enrollment_date ON students(enrollment_date);

-- Create Triggers for Data Validation
DELIMITER //

CREATE TRIGGER before_student_insert
BEFORE INSERT ON students
FOR EACH ROW
BEGIN
    -- Validate email format
    IF NEW.email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid email format';
    END IF;
    
    -- Validate age (must be at least 16)
    IF TIMESTAMPDIFF(YEAR, NEW.date_of_birth, CURDATE()) < 16 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student must be at least 16 years old';
    END IF;
END //

DELIMITER ;

-- Useful Queries for Reports
-- Query to get student count by course
CREATE VIEW students_per_course AS
SELECT 
    c.course_id,
    c.course_name,
    COUNT(s.student_id) as student_count
FROM courses c
LEFT JOIN students s ON c.course_id = s.course_id
GROUP BY c.course_id, c.course_name;

-- Query to get students by age group
CREATE VIEW students_by_age_group AS
SELECT 
    CASE 
        WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) < 20 THEN 'Under 20'
        WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 20 AND 25 THEN '20-25'
        ELSE 'Over 25'
    END as age_group,
    COUNT(*) as student_count
FROM students
GROUP BY age_group;

-- Grant appropriate permissions (adjust as needed)
-- CREATE USER 'student_app'@'localhost' IDENTIFIED BY 'secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON student_registration_system.* TO 'student_app'@'localhost';
-- FLUSH PRIVILEGES;

###  .env file  

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_registration_system
DB_PORT=3306
SERVER_PORT=3000

### Commands to start  

install backend 
create env file

npm init -y
npm install express mysql2 cors dotenv body-parser express-validator
npm install --save-dev nodemon

npm run dev

### files    

student-registration-backend/
├── config/
│   └── database.js
├── models/
│   ├── Student.js
│   └── Course.js
├── routes/
│   ├── studentRoutes.js
│   └── courseRoutes.js
├── .env
├── server.js
└── package.json

### ER diagram

[STUDENTS] ----< enrolls in >---- [COURSES]
    |                                 |
    ├─ student_id (PK)               ├─ course_id (PK)
    ├─ first_name                    ├─ course_name
    ├─ last_name                     └─ description
    ├─ email
    ├─ phone
    ├─ date_of_birth
    ├─ gender
    ├─ address
    └─ course_id (FK)

