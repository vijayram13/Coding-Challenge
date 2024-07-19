// src/components/PieChart.js
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { getPieChart } from '../services/api';

const PieChart = ({ month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPieChartData();
  }, [month]);

  const fetchPieChartData = async () => {
    try {
      const response = await getPieChart({ month });
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        label: 'Number of Items',
        data: data.map(d => d.count),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
