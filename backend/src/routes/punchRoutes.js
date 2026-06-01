const express = require('express');
const router = express.Router();
const {
  createPunch,
  getTodayPunches,
  getPunchHistory,
} = require('../controllers/punchController');
const { authenticate } = require('../middleware/auth');
const { punchLimiter } = require('../middleware/rateLimiter');

// Criar ponto
router.post('/', authenticate, punchLimiter, createPunch);

// Pegar pontos de hoje
router.get('/today', authenticate, getTodayPunches);

// Pegar histórico
router.get('/history', authenticate, getPunchHistory);

module.exports = router;
