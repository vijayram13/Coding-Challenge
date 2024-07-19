const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/initialize-database', transactionController.initializeDatabase);
router.get('/transactions', transactionController.listTransactions);
router.get('/statistics', transactionController.getStatistics);
router.get('/barchart', transactionController.getBarChart);
router.get('/piechart', transactionController.getPieChart);
router.get('/combined-data', transactionController.getCombinedData);

module.exports = router;
