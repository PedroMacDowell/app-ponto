const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: process.env.API_LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
      }`;
    })
  ),
  defaultMeta: { service: 'app-ponto-backend' },
  transports: [
    // Arquivo de erro
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
    }),
    // Arquivo geral
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
    }),
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ level, message, timestamp }) =>
            `${timestamp} [${level}]: ${message}`
        )
      ),
    }),
  ],
});

module.exports = logger;
