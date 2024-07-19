// src/App.js
import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
  const [month, setMonth] = useState('March');

  return (
    <div className="App">
      <h1>MERN Coding Challenge</h1>
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <TransactionsTable month={month} />
      {/* <Statistics month={month} />
      <BarChart month={month} />
      <PieChart month={month} /> */}
    </div>
  );
};

export default App;
