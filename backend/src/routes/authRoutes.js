const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyToken,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

// Registrar
router.post('/register', register);

// Login com rate limiting
router.post('/login', loginLimiter, login);

// Verificar token
router.get('/verify', authenticate, verifyToken);

module.exports = router;
