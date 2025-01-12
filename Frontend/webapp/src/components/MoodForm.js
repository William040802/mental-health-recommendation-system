import React, { useState } from 'react';

const MoodForm = ({ onSubmit }) => {
  const [mood, setMood] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('No token found. Please log in first.');
      return;
    }

    // Validate mood
    const moodValue = Number(mood);
    if (isNaN(moodValue) || moodValue < 0 || moodValue > 10) {
      setErrorMessage('Mood must be a number between 0 and 10.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mood: moodValue }),
      });

      if (response.ok) {
        const savedMood = await response.json();
        onSubmit(savedMood); // Update parent state with the new mood
        setMood(''); // Reset the mood input
        setErrorMessage('');
      } else {
        const errorText = await response.text();
        setErrorMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div style={{ marginBottom: '10px' }}>
        <label>
          Mood (0-10):
          <input
            type="number"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            min="0"
            max="10"
            required
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>
      <button type="submit" style={{ padding: '5px 10px' }}>
        Add Mood
      </button>
    </form>
  );
};

export default MoodForm;
