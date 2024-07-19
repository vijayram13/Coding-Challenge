// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getTransactions = (params) => axios.get(`${API_URL}/transactions`, { params });
export const getStatistics = (params) => axios.get(`${API_URL}/statistics`, { params });
export const getBarChart = (params) => axios.get(`${API_URL}/barchart`, { params });
export const getPieChart = (params) => axios.get(`${API_URL}/piechart`, { params });
export const getCombinedData = (params) => axios.get(`${API_URL}/combined-data`, { params });
