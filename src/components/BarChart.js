// src/components/BarChart.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getBarChart } from '../services/api';

const BarChart = ({ month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBarChartData();
  }, [month]);

  const fetchBarChartData = async () => {
    try {
      const response = await getBarChart({ month });
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const chartData = {
    labels: data.map(d => d.range),
    datasets: [
      {
        label: 'Number of Items',
        data: data.map(d => d.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default BarChart;
