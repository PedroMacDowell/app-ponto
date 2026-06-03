require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');

const authRoutes = require('./routes/authRoutes');
const punchRoutes = require('./routes/punchRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Middleware de segurança
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Rate limiting geral
app.use(apiLimiter);

// Log de requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/punch', punchRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Erro na aplicação', {
    error: err.message,
    stack: err.stack,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
  });
});

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/app-ponto', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Conectado ao MongoDB');
  } catch (error) {
    logger.error('Erro ao conectar ao MongoDB', { error: error.message });
    process.exit(1);
  }
};

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
    console.log(`
    ╔═══════════════════════════════════╗
    ║   App Ponto Backend               ║
    ║   Rodando em: http://localhost:${PORT}   ║
    ║   Ambiente: ${process.env.NODE_ENV || 'development'}  ║
    ╚═══════════════════════════════════╝
    `);
  });
};

startServer().catch((error) => {
  logger.error('Erro ao iniciar servidor', { error: error.message });
  process.exit(1);
});

module.exports = app;
