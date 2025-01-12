import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodForm from '../components/MoodForm';
import MoodChart from '../components/MoodChart';

const MoodTracker = () => {
  const [moods, setMoods] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchMoods(token);
    }
  }, [navigate]);

  const fetchMoods = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/moods', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Optional: format dates if needed
        const formattedData = data.map((entry) => ({
          ...entry,
          date: entry.date ? new Date(entry.date).toISOString() : null,
        }));

        setMoods(formattedData);
      } else {
        const errorText = await response.text();
        setMessage(`Error fetching moods: ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching moods:', error);
      setMessage('Error connecting to the server.');
    }
  };

  // Called when a new mood is submitted successfully
  const addMood = (savedMood) => {
    // Optionally re-fetch from server, or just append for immediate UI update
    setMoods((prev) => [...prev, savedMood.mood]);
    // savedMood looks like { message: "...", mood: {...} }, so we do .mood
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Mood Tracker</h1>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      {/* The form to add a mood */}
      <MoodForm onSubmit={addMood} />
      {/* Display chart if we have moods */}
      {moods.length > 0 ? (
        <MoodChart moodData={moods} />
      ) : (
        <p>No moods yet. Add your first mood!</p>
      )}
    </div>
  );
};

export default MoodTracker;
