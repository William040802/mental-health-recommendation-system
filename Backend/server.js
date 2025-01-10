const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER || 'root', // Replace with your DB username
    password: process.env.DB_PASSWORD || '', // Replace with your DB password
    database: process.env.DB_NAME || 'mental_health_app', // Replace with your DB name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to the MySQL database.');
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
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
        if (err) return res.status(500).send('Error checking username');
        if (results.length > 0) return res.status(400).send('Username already exists');

        db.query(insertQuery, [username, password], (err) => {
            if (err) return res.status(500).send('Error registering user');
            res.send('User registered successfully');
        });
    });
});

app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).send('Error logging in');
        if (results.length === 0) return res.status(400).send('Invalid username or password');

        const user = results[0];
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    });
});

// Mood Routes
app.get('/moods', authenticateToken, (req, res) => {
    const userId = req.user.id;

    const query = 'SELECT * FROM moods WHERE user_id = ? ORDER BY date DESC';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching moods:', err);
            return res.status(500).send('Error fetching mood data');
        }
        res.json(results);
    });
});

app.post('/moods', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { mood } = req.body;

    const date = new Date();
    const query = 'INSERT INTO moods (user_id, mood, date) VALUES (?, ?, ?)';

    db.query(query, [userId, mood, date], (err) => {
        if (err) {
            console.error('Error saving mood:', err);
            return res.status(500).send('Error saving mood data');
        }
        res.send('Mood added successfully');
    });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
