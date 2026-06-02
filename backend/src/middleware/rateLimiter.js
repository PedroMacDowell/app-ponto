const rateLimit = require('express-rate-limit');

// Limitar 5 tentativas de login por IP em 15 minutos
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Muitas tentativas de login. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitar 100 requisições por IP em 1 minuto para endpoints gerais
exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter para criação de ponto (máximo 3 por minuto)
exports.punchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  skip: (req) => req.user?.role === 'admin',
  message: 'Muitas batidas de ponto. Tente novamente em alguns momentos.',
});
