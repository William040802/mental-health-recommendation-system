router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.id;

    console.log('Fetching moods for user:', userId); // Debugging log

    db.query('SELECT * FROM moods WHERE user_id = ? ORDER BY date DESC', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching moods:', err);
            return res.status(500).send('Error fetching mood data');
        }
        console.log('Mood data fetched:', results); // Debugging log
        res.json(results);
    });
});


router.post('/', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { mood } = req.body;

    console.log('POST /moods request received for user:', userId, 'with mood:', mood);

    const date = new Date();
    db.query(
        'INSERT INTO moods (user_id, mood, date) VALUES (?, ?, ?)',
        [userId, mood, date],
        (err) => {
            if (err) {
                console.error('Error saving mood:', err);
                return res.status(500).send('Error saving mood data');
            }
            console.log('Mood added successfully for user:', userId);
            res.send('Mood added successfully');
        }
    );
});
