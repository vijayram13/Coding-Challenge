// const axios = require('axios');
// const Transaction = require('../models/Transaction');

// exports.initializeDatabase = async (req, res) => {
//     try {
//         const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
//         const transactions = response.data;

//         console.log(response.data);
//         await Transaction.deleteMany({});
//         await Transaction.insertMany(transactions);

//         res.status(200).json({ message: 'Database initialized' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.listTransactions = async (req, res) => {
//     const { month, search = '', page = 1, perPage = 10 } = req.query;
//     console.log(month, search, page, perPage);
//     const monthNumber = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;
//     console.log(monthNumber)
//     try {
//         const query = {
//             dateOfSale: { $regex: `^\\d{4}-${monthNumber.toString().padStart(2, '0')}` },
//             $or: [
//                 { title: { $regex: search, $options: 'i' } },
//                 { description: { $regex: search, $options: 'i' } },
//                 { price: { $regex: search, $options: 'i' } },
//             ],
//         };

//         console.log(query);
//         const transactions = await Transaction.find(query)
//             .skip((page - 1) * perPage)
//             .limit(Number(perPage));

//         res.status(200).json(transactions);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getStatistics = async (req, res) => {
//     const { month } = req.query;
//     const monthNumber = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;
//     const dateRegex = new RegExp(`^\\d{4}-${monthNumber.toString().padStart(2, '0')}`);

//     try {
//         const totalSale = await Transaction.aggregate([
//             { $match: { dateOfSale: { $regex: dateRegex }, sold: true } },
//             { $group: { _id: null, total: { $sum: "$price" } } }
//         ]);

//         const totalSoldItems = await Transaction.countDocuments({ dateOfSale: { $regex: dateRegex }, sold: true });
//         const totalNotSoldItems = await Transaction.countDocuments({ dateOfSale: { $regex: dateRegex }, sold: false });

//         res.status(200).json({
//             totalSale: totalSale[0]?.total || 0,
//             totalSoldItems,
//             totalNotSoldItems,
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getBarChart = async (req, res) => {
//     const { month } = req.query;
//     const monthNumber = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;
//     const dateRegex = new RegExp(`^\\d{4}-${monthNumber.toString().padStart(2, '0')}`);

//     try {
//         const priceRanges = [
//             { range: '0-100', min: 0, max: 100 },
//             { range: '101-200', min: 101, max: 200 },
//             { range: '201-300', min: 201, max: 300 },
//             { range: '301-400', min: 301, max: 400 },
//             { range: '401-500', min: 401, max: 500 },
//             { range: '501-600', min: 501, max: 600 },
//             { range: '601-700', min: 601, max: 700 },
//             { range: '701-800', min: 701, max: 800 },
//             { range: '801-900', min: 801, max: 900 },
//             { range: '901-above', min: 901, max: Infinity },
//         ];

//         const barChartData = await Promise.all(priceRanges.map(async (range) => {
//             const count = await Transaction.countDocuments({
//                 dateOfSale: { $regex: dateRegex },
//                 price: { $gte: range.min, $lte: range.max }
//             });
//             return { range: range.range, count };
//         }));

//         res.status(200).json(barChartData);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getPieChart = async (req, res) => {
//     const { month } = req.query;
//     const monthNumber = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;
//     const dateRegex = new RegExp(`^\\d{4}-${monthNumber.toString().padStart(2, '0')}`);

//     try {
//         const pieChartData = await Transaction.aggregate([
//             { $match: { dateOfSale: { $regex: dateRegex } } },
//             { $group: { _id: "$category", count: { $sum: 1 } } },
//             { $project: { _id: 0, category: "$_id", count: 1 } }
//         ]);

//         res.status(200).json(pieChartData);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getCombinedData = async (req, res) => {
//     try {
//         const statistics = await exports.getStatistics(req, res);
//         const barChart = await exports.getBarChart(req, res);
//         const pieChart = await exports.getPieChart(req, res);

//         res.status(200).json({
//             statistics,
//             barChart,
//             pieChart
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };



// controllers/transactionController.js
const axios = require('axios');
const Transaction = require('../models/Transaction');

const getStartEndDateOfMonth = (month) => {
    const monthNumber = new Date(Date.parse(month + " 1, 2024")).getMonth();
    const startDate = new Date(2024, monthNumber, 1);
    const endDate = new Date(2024, monthNumber + 1, 0, 23, 59, 59);
    return { startDate, endDate };
};

exports.initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany({});
        await Transaction.insertMany(transactions);

        res.status(200).json({ message: 'Database initialized' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listTransactions = async (req, res) => {
    const { month, search = '', page = 1, perPage = 10 } = req.query;
    console.log(month, search, page, perPage);
    const { startDate, endDate } = getStartEndDateOfMonth(month);
    console.log(startDate, endDate);
    try {
        const query = {
            dateOfSale: { $gte: startDate, $lte: endDate },
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: { $regex: search, $options: 'i' } },
            ],
        };
        console.log(query['$or']);
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));
        console.log("transactions", transactions);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStatistics = async (req, res) => {
    const { month } = req.query;
    const { startDate, endDate } = getStartEndDateOfMonth(month);

    try {
        const totalSale = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate }, sold: true } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        const totalSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: true });
        const totalNotSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: false });

        res.status(200).json({
            totalSale: totalSale[0]?.total || 0,
            totalSoldItems,
            totalNotSoldItems,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBarChart = async (req, res) => {
    const { month } = req.query;
    const { startDate, endDate } = getStartEndDateOfMonth(month);

    try {
        const priceRanges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity },
        ];

        const barChartData = await Promise.all(priceRanges.map(async (range) => {
            const count = await Transaction.countDocuments({
                dateOfSale: { $gte: startDate, $lte: endDate },
                price: { $gte: range.min, $lte: range.max }
            });
            return { range: range.range, count };
        }));

        res.status(200).json(barChartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPieChart = async (req, res) => {
    const { month } = req.query;
    const { startDate, endDate } = getStartEndDateOfMonth(month);

    try {
        const pieChartData = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $project: { _id: 0, category: "$_id", count: 1 } }
        ]);

        res.status(200).json(pieChartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCombinedData = async (req, res) => {
    try {
        const statistics = await exports.getStatistics(req, res);
        const barChart = await exports.getBarChart(req, res);
        const pieChart = await exports.getPieChart(req, res);

        res.status(200).json({
            statistics,
            barChart,
            pieChart
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
