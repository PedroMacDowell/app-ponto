const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Token inválido', {
      ip: req.ip,
      error: error.message,
    });

    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }
};

exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado',
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão',
      });
    }

    next();
  };
};
