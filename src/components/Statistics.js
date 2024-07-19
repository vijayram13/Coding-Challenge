// src/components/Statistics.js
import React, { useState, useEffect } from 'react';
import { getStatistics } from '../services/api';

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  const fetchStatistics = async () => {
    try {
      const response = await getStatistics({ month });
      setStatistics(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Statistics for {month}</h3>
      <p>Total Sale Amount: ${statistics.totalSale}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default Statistics;
