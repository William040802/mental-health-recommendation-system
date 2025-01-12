const express = require('express');
const router = express.Router();
const db = require('./db'); // Your database connection
const authenticateToken = require('./authMiddleware'); // JWT auth middleware

// GET /moods - Fetch all moods for the authenticated user
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.id;

    db.query('SELECT * FROM moods WHERE user_id = ? ORDER BY date DESC', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching moods:', err.message);
            return res.status(500).json({ error: 'Error fetching mood data' });
        }

        // If you need to ensure date is ISO string on the frontend, convert it here:
        // But it’s optional if the frontend handles it well or just displays it raw.
        const formattedResults = results.map((entry) => ({
            ...entry,
            // Convert date to ISO for consistency (optional):
            date: new Date(entry.date).toISOString(),
        }));

        res.json(formattedResults);
    });
});

// POST /moods - Add a new mood for the authenticated user
router.post('/', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { mood } = req.body;

    // Validate mood
    if (typeof mood !== 'number' || mood < 0 || mood > 10) {
        return res.status(400).json({ error: 'Mood must be a number between 0 and 10' });
    }

    // Generate a new timestamp for each request
    const date = new Date();

    // Insert mood into the database
    const query = 'INSERT INTO moods (user_id, mood, date) VALUES (?, ?, ?)';
    db.query(query, [userId, mood, date], (err, results) => {
        if (err) {
            console.error('Error saving mood:', err.message);
            return res.status(500).json({ error: 'Error saving mood data' });
        }

        // Return the newly added mood
        res.status(201).json({
            message: 'Mood added successfully',
            mood: {
                id: results.insertId,
                userId,
                mood,
                date: date.toISOString(), // Send back the dynamically generated date
            },
        });
    });
});


module.exports = router;
