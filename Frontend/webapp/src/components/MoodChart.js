import React from 'react';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register required Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const MoodChart = ({ moodData = [] }) => {
  console.log('MoodChart received data:', moodData); // Debugging log

  const data = {
    labels: moodData.map((entry) => entry.date), // X-axis: Dates
    datasets: [
      {
        label: 'Mood over Time',
        data: moodData.map((entry) => entry.mood), // Y-axis: Mood values
        fill: false,
        borderColor: 'blue', // Line color
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div>
      <h2>Mood Trends</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default MoodChart;
