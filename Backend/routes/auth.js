const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
require('dotenv').config();

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if the username already exists
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).send('Server error');
        if (results.length > 0) return res.status(400).send('Username already exists');

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
            if (err) return res.status(500).send('Error saving user');
            res.status(201).send('User registered successfully');
        });
    });
});

// Login a user
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the username exists
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).send('Server error');
        if (results.length === 0) return res.status(400).send('Invalid username or password');

        const user = results[0];

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid username or password');

        // Generate a JWT
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

module.exports = router;
