const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'], // Allow Authorization header
}));
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER || 'root', // Replace with your DB username
    password: process.env.DB_PASSWORD || '', // Replace with your DB password
    database: process.env.DB_NAME || 'mental_health_app', // Replace with your DB name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    }
    console.log('Connected to the MySQL database.');
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    console.log('authenticateToken middleware invoked'); // Debug log
    const authHeader = req.header('Authorization');
    console.log('Full Authorization header:', authHeader); // Debug log

    if (!authHeader) {
        console.error('Authorization header is missing');
        return res.status(401).send('Access Denied: No token provided');
    }

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader; // Fallback for tokens without Bearer prefix

    if (!token) {
        console.error('Token is missing after extraction');
        return res.status(401).send('Access Denied: Token is missing');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Invalid Token:', err.message);
            if (err.name === 'JsonWebTokenError') {
                return res.status(400).send('Invalid Token: Malformed or invalid signature');
            } else if (err.name === 'TokenExpiredError') {
                return res.status(401).send('Invalid Token: Token has expired');
            } else {
                return res.status(403).send('Invalid Token: Verification failed');
            }
        }
        console.log('Authenticated user:', user); // Debug log
        req.user = user;
        next();
    });
};

// Routes

// Authentication Routes
app.post('/auth/register', (req, res) => {
    const { username, password } = req.body;

    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';

    db.query(checkQuery, [username], (err, results) => {
        if (err) {
            console.error('Error checking username:', err.message);
            return res.status(500).send('Error checking username');
        }
        if (results.length > 0) return res.status(400).send('Username already exists');

        db.query(insertQuery, [username, password], (err) => {
            if (err) {
                console.error('Error registering user:', err.message);
                return res.status(500).send('Error registering user');
            }
            res.send('User registered successfully');
        });
    });
});

app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error logging in:', err.message);
            return res.status(500).send('Error logging in');
        }
        if (results.length === 0) return res.status(400).send('Invalid username or password');

        const user = results[0];
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('User logged in:', user); // Debug log
        res.json({ token });
    });
});

// Mood Routes
app.get('/moods', authenticateToken, (req, res) => {
    console.log('GET /moods route hit'); // Debug log

    const userId = req.user.id;
    console.log('Fetching moods for user:', userId); // Debug log

    const query = 'SELECT * FROM moods WHERE user_id = ? ORDER BY date DESC';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching moods:', err.message);
            return res.status(500).send('Error fetching mood data');
        }
        console.log('Mood data fetched:', results); // Debug log
        res.json(results);
    });
});

app.post('/moods', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { mood } = req.body;

    const date = new Date(); // Capture precise timestamp
    const query = 'INSERT INTO moods (user_id, mood, date) VALUES (?, ?, ?)';

    db.query(query, [userId, mood, date], (err, results) => {
        if (err) {
            console.error('Error saving mood:', err);
            return res.status(500).json({ error: 'Error saving mood data' });
        }

        console.log('Mood added successfully for user:', userId);

        // Send a proper JSON response
        res.status(201).json({
            message: 'Mood added successfully',
            mood: {
                id: results.insertId || null, // Use the inserted ID if available
                userId,
                mood,
                date,
            },
        });
    });
});


// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
