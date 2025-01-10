import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MoodTracker() {
    const [moods, setMoods] = useState([]); // Store past mood data
    const [mood, setMood] = useState(''); // Store current mood input
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if not authenticated
        } else {
            fetchMoodData(token);
        }
    }, [navigate]);

    // Fetch past mood data
    const fetchMoodData = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/moods', {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMoods(data);
            } else {
                const errorMessage = await response.text();
                setMessage(`Error fetching mood data: ${errorMessage}`);
            }
        } catch (error) {
            setMessage('Error connecting to the server.');
        }
    };

    // Submit new mood
    const handleMoodSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        try {
            const response = await fetch('http://localhost:5000/moods', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include Bearer keyword
                },
                body: JSON.stringify({ mood: parseInt(mood, 10) }), // Ensure mood is sent as an integer
            });
    
            if (response.ok) {
                setMessage('Mood added successfully!');
                setMood('');
            } else {
                const errorMessage = await response.text();
                setMessage(`Error adding mood: ${errorMessage}`);
            }
        } catch (error) {
            setMessage('Error connecting to the server.');
        }
    };
    

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
            <h2>Mood Tracker</h2>
            <form onSubmit={handleMoodSubmit} style={{ marginBottom: '20px' }}>
                <label>
                    Enter your mood (1-10):
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        required
                        style={{ marginLeft: '10px', padding: '5px' }}
                    />
                </label>
                <button type="submit" style={{ marginLeft: '10px', padding: '5px 10px' }}>
                    Submit
                </button>
            </form>
            {message && <p>{message}</p>}
            <h3>Past Moods</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {moods.map((entry) => (
                    <li key={entry.id} style={{ marginBottom: '10px' }}>
                        Mood: {entry.mood} | Date: {new Date(entry.date).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MoodTracker;
