import React, { useState } from 'react';

const MoodForm = ({ onSubmit }) => {
  const [mood, setMood] = useState('');

  const handleSubmit = async (mood) => {
    const token = localStorage.getItem('token'); // Retrieve token
    console.log('Token being sent:', token); // Debugging log

    try {
        const response = await fetch('http://localhost:5000/moods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Attach the token
            },
            body: JSON.stringify({ mood }),
        });

        if (response.ok) {
            console.log('Mood added successfully');
        } else {
            const errorText = await response.text();
            console.error('Error adding mood:', errorText);
        }
    } catch (error) {
        console.error('Error adding mood:', error);
    }
}

};

export default MoodForm;
