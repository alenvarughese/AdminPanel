const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../Controller/dashboardController');

router.get('/api/dashboard-stats', getDashboardStats);

module.exports = router;
