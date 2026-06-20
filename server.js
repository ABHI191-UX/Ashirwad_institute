// server.js - Main Node.js/Express Server
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root@123',
     database: process.env.DB_NAME || 'ashirwad_typing', // Fixed typo here
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==================== API ENDPOINTS ====================

// 1. GET all courses
app.get('/api/courses', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [courses] = await connection.query('SELECT * FROM courses');
        connection.release();
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// 2. GET course by ID
app.get('/api/courses/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [course] = await connection.query('SELECT * FROM courses WHERE course_id = ?', [req.params.id]);
        connection.release();
        
        if (course.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(course[0]);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

// 3. POST new student inquiry
app.post('/api/inquiries', async (req, res) => {
    const { fullName, mobile, email, course, timing, message } = req.body;

    // Validation
    if (!fullName || !mobile || !course) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!/^\d{10}$/.test(mobile)) {
        return res.status(400).json({ error: 'Invalid mobile number' });
    }

    try {
        const connection = await pool.getConnection();
        const query = `
            INSERT INTO inquiries (full_name, mobile, email, course, timing, message, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
        `;
        const result = await connection.execute(query, [fullName, mobile, email || null, course, timing || null, message || null]);
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Inquiry submitted successfully',
            inquiryId: result[0].insertId
        });

        // Send notification email (optional)
        sendInquiryNotification(fullName, mobile, email, course);
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
});

// 4. GET all inquiries (Admin)
app.get('/api/admin/inquiries', async (req, res) => {
    try {
        // In production, add authentication middleware here
        const connection = await pool.getConnection();
        const [inquiries] = await connection.query('SELECT * FROM inquiries ORDER BY created_at DESC');
        connection.release();
        res.json(inquiries);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});

// 5. UPDATE inquiry status (Admin)
app.put('/api/admin/inquiries/:id', async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'contacted', 'enrolled', 'rejected'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const connection = await pool.getConnection();
        await connection.execute('UPDATE inquiries SET status = ? WHERE inquiry_id = ?', [status, req.params.id]);
        connection.release();
        res.json({ success: true, message: 'Inquiry status updated' });
    } catch (error) {
        console.error('Error updating inquiry:', error);
        res.status(500).json({ error: 'Failed to update inquiry' });
    }
});

// 6. DELETE inquiry (Admin)
app.delete('/api/admin/inquiries/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const result = await connection.execute('DELETE FROM inquiries WHERE inquiry_id = ?', [req.params.id]);
        connection.release();

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }
        res.json({ success: true, message: 'Inquiry deleted' });
    } catch (error) {
        console.error('Error deleting inquiry:', error);
        res.status(500).json({ error: 'Failed to delete inquiry' });
    }
});

// 7. GET all notices
app.get('/api/notices', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [notices] = await connection.query('SELECT * FROM notices ORDER BY created_at DESC LIMIT 10');
        connection.release();
        res.json(notices);
    } catch (error) {
        console.error('Error fetching notices:', error);
        res.status(500).json({ error: 'Failed to fetch notices' });
    }
});

// 8. POST new notice (Admin)
app.post('/api/admin/notices', async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        const connection = await pool.getConnection();
        const result = await connection.execute(
            'INSERT INTO notices (title, description, created_at) VALUES (?, ?, NOW())',
            [title, description]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Notice created successfully',
            noticeId: result[0].insertId
        });
    } catch (error) {
        console.error('Error creating notice:', error);
        res.status(500).json({ error: 'Failed to create notice' });
    }
});

// 9. GET testimonials
app.get('/api/testimonials', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [testimonials] = await connection.query('SELECT * FROM testimonials WHERE approved = 1 ORDER BY created_at DESC');
        connection.release();
        res.json(testimonials);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
});

// 10. POST new testimonial
app.post('/api/testimonials', async (req, res) => {
    const { studentName, course, rating, testimonialText, email } = req.body;

    if (!studentName || !rating || !testimonialText) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    try {
        const connection = await pool.getConnection();
        const result = await connection.execute(
            'INSERT INTO testimonials (student_name, course, rating, testimonial_text, email, approved, created_at) VALUES (?, ?, ?, ?, ?, 0, NOW())',
            [studentName, course || null, rating, testimonialText, email || null]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Testimonial submitted successfully. It will be published after admin approval.',
            testimonialId: result[0].insertId
        });
    } catch (error) {
        console.error('Error submitting testimonial:', error);
        res.status(500).json({ error: 'Failed to submit testimonial' });
    }
});

// 11. GET institute info
app.get('/api/institute-info', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [info] = await connection.query('SELECT * FROM institute_info WHERE id = 1');
        connection.release();
        
        res.json(info[0] || {
            name: 'Ghewari Typing Institute',
            address: '123, Main Street, Mumbai',
            phone1: '+91 98765 43210',
            phone2: '+91 98765 43211',
            email: 'info@ghewaritypinginstitute.com'
        });
    } catch (error) {
        console.error('Error fetching institute info:', error);
        res.status(500).json({ error: 'Failed to fetch institute info' });
    }
});

// 12. UPDATE institute info (Admin)
app.put('/api/admin/institute-info', async (req, res) => {
    const { name, address, phone1, phone2, email, about } = req.body;

    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'UPDATE institute_info SET name = ?, address = ?, phone1 = ?, phone2 = ?, email = ?, about = ? WHERE id = 1',
            [name, address, phone1, phone2, email, about]
        );
        connection.release();

        res.json({ success: true, message: 'Institute info updated' });
    } catch (error) {
        console.error('Error updating institute info:', error);
        res.status(500).json({ error: 'Failed to update institute info' });
    }
});

// 13. GET statistics (Admin)
app.get('/api/admin/statistics', async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [totalInquiries] = await connection.query('SELECT COUNT(*) as total FROM inquiries');
        const [enrolledStudents] = await connection.query('SELECT COUNT(*) as total FROM inquiries WHERE status = "enrolled"');
        const [totalCourses] = await connection.query('SELECT COUNT(*) as total FROM courses');
        const [recentInquiries] = await connection.query('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5');

        connection.release();

        res.json({
            totalInquiries: totalInquiries[0].total,
            enrolledStudents: enrolledStudents[0].total,
            totalCourses: totalCourses[0].total,
            recentInquiries: recentInquiries
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// ==================== HELPER FUNCTIONS ====================

function sendInquiryNotification(name, mobile, email, course) {
    // Implement email sending here
    // You can use nodemailer or SendGrid
    console.log(`Inquiry notification: ${name} (${mobile}) interested in ${course}`);
}

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('API endpoints available at http://localhost:${PORT}/api/');
});

module.exports = app;