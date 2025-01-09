import React, { useState } from 'react';

const MoodForm = ({ onSubmit }) => {
  const [mood, setMood] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mood) {
      onSubmit({ mood: parseInt(mood), date: new Date().toLocaleDateString() }); // Ensure mood is a number
      setMood(''); // Clear the input
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="mood">Enter your mood (1-10):</label>
      <input
        type="number"
        id="mood"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="e.g., 7"
        min="1"
        max="10"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MoodForm;
