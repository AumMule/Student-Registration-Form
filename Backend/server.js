const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import Routes
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');

// Use Routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`  - GET    /api/students      - Get all students`);
    console.log(`  - GET    /api/students/:id  - Get student by ID`);
    console.log(`  - POST   /api/students      - Create new student`);
    console.log(`  - PUT    /api/students/:id  - Update student`);
    console.log(`  - DELETE /api/students/:id  - Delete student`);
    console.log(`  - GET    /api/courses       - Get all courses`);
});