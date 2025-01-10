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

  // Prepare data for the chart
  const data = {
    labels: moodData.map((entry) => new Date(entry.date).toLocaleString()), // Include time for uniqueness
    datasets: [
        {
            label: 'Mood over Time',
            data: moodData.map((entry) => entry.mood),
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            tension: 0.4,
            pointRadius: 5,
        },
    ],
};


  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Mood Level',
        },
        min: 0, // Ensure minimum value
        max: 10, // Assume mood is on a scale of 0-10
        ticks: {
          stepSize: 1, // Steps for Y-axis
        },
      },
    },
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Mood Trends</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default MoodChart;
