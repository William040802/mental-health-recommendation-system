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
import zoomPlugin from 'chartjs-plugin-zoom';

// Register Chart.js components and plugins
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin // Register zoom plugin
);

const MoodChart = ({ moodData = [] }) => {
  // Debugging: Check the data passed to the chart
  console.log('MoodChart received data:', moodData);

  // Prepare the data for the chart
  const data = {
    labels: moodData.map((entry) => new Date(entry.date).toLocaleDateString()), // Format dates
    datasets: [
      {
        label: 'Mood over Time',
        data: moodData.map((entry) => entry.mood), // Mood values
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.4, // Smoothing for the line
        pointRadius: 5, // Size of points on the graph
      },
    ],
  };

  // Configure chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      zoom: {
        pan: {
          enabled: true, // Allow panning
          mode: 'x', // Horizontal panning
        },
        zoom: {
          wheel: {
            enabled: true, // Allow zooming with the mouse wheel
          },
          pinch: {
            enabled: true, // Allow zooming with touch gestures
          },
          mode: 'x', // Horizontal zooming
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date', // X-axis label
        },
      },
      y: {
        title: {
          display: true,
          text: 'Mood Level', // Y-axis label
        },
        min: 0,
        max: 10,
        ticks: { stepSize: 1 }, // Ensure integer steps
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
