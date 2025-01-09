import React, { useState } from 'react';
import MoodForm from '../components/MoodForm';
import MoodChart from '../components/MoodChart';

const Home = () => {
  const [moodData, setMoodData] = useState([
    { date: '2025-01-01', mood: 5 },
    { date: '2025-01-02', mood: 4 },
  ]);

  const addMood = (newMood) => {
    setMoodData([...moodData, newMood]);
  };

  return (
    <div>
      <h1>Welcome to the Mood Tracker!</h1>
      <MoodForm onSubmit={addMood} />
      <MoodChart moodData={moodData} />
    </div>
  );
};

export default Home;
