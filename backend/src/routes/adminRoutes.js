const express = require('express');
const router = express.Router();
const { getTodayDashboard } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/dashboard/today', authenticate, authorize(['admin']), getTodayDashboard);

module.exports = router;
