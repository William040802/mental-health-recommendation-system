const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
require('dotenv').config();

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) {
                console.error('Error checking username:', err.message);
                return res.status(500).send('Server error');
            }
            if (results.length > 0) return res.status(400).send('Username already exists');

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user into the database
            db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
                if (err) {
                    console.error('Error inserting user:', err.message);
                    return res.status(500).send('Error saving user');
                }
                console.log(`User registered successfully: ${username}`);
                res.status(201).send('User registered successfully');
            });
        });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).send('Server error');
    }
});

// Login an existing user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username exists
        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) {
                console.error('Error fetching user:', err.message);
                return res.status(500).send('Server error');
            }
            if (results.length === 0) {
                console.warn(`Login failed for non-existent user: ${username}`);
                return res.status(400).send('Invalid username or password');
            }

            const user = results[0];

            // Compare the password with the hashed password in the database
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.warn(`Password mismatch for user: ${username}`);
                return res.status(400).send('Invalid username or password');
            }

            // Debugging: Ensure JWT_SECRET is loaded
            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET is not defined. Check your .env file.');
                return res.status(500).send('Server configuration error: Missing JWT secret');
            }
            console.log('JWT_SECRET during token generation:', process.env.JWT_SECRET);

            // Generate a JWT
            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            console.log(`Generated token for user: ${token}`); // Debugging log
            res.json({ token }); // Send token to the client
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
