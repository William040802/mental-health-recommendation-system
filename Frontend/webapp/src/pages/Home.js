import React, { useState, useEffect } from 'react';
import MoodForm from '../components/MoodForm';
import MoodChart from '../components/MoodChart';

const Home = () => {
  const [moodData, setMoodData] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMoods = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No token found. Please log in.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/moods', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched moods:', data);
          setMoodData(data);
        } else {
          const errorText = await response.text();
          setMessage(`Error: ${errorText}`);
        }
      } catch (error) {
        console.error('Error fetching moods:', error);
        setMessage('Error: Unable to fetch moods.');
      }
    };

    fetchMoods();
  }, []);

  const addMood = (newMood) => {
    setMoodData((prev) => [...prev, newMood]);
  };

  return (
    <div>
      <h1>Welcome to the Mood Tracker!</h1>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <MoodForm onSubmit={addMood} />
      <MoodChart moodData={moodData} />
    </div>
  );
};

export default Home;
