const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

const getRoleForEmail = (email) => {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.toLowerCase()) ? 'admin' : 'employee';
};

const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      userId: user.userId,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validações
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Senhas não conferem',
      });
    }

    // Verificar se usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      await AuditLog.create({
        action: 'user_created',
        status: 'error',
        email,
        description: 'Tentativa de registro com email já existente',
        ipAddress: req.ip,
        deviceId: req.body.deviceId,
      });

      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado',
      });
    }

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password,
      role: getRoleForEmail(email),
      deviceInfo: {
        deviceId: req.body.deviceId,
        deviceName: req.body.deviceName,
        osVersion: req.body.osVersion,
        appVersion: req.body.appVersion,
      },
    });

    // Log de auditoria
    await AuditLog.create({
      action: 'user_created',
      status: 'success',
      userId: user.userId,
      email,
      description: `Novo usuário registrado: ${name}`,
      ipAddress: req.ip,
      deviceId: req.body.deviceId,
    });

    // Gerar token
    const token = signToken(user);

    logger.info('Usuário registrado com sucesso', {
      email,
      userId: user.userId,
    });

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    logger.error('Erro no registro', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário',
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, deviceId, deviceName, osVersion } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios',
      });
    }

    // Buscar usuário com senha
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      await AuditLog.create({
        action: 'login_failed',
        status: 'error',
        email,
        description: 'Usuário não encontrado',
        ipAddress: req.ip,
        deviceId,
      });

      logger.warn('Login falhou: usuário não encontrado', { email });
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos',
      });
    }

    // Comparar senha
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Registrar tentativa falhada
      user.loginHistory.push({
        timestamp: new Date(),
        ip: req.ip,
        deviceId,
        success: false,
      });
      await user.save();

      await AuditLog.create({
        action: 'login_failed',
        status: 'error',
        userId: user.userId,
        email,
        description: 'Senha incorreta',
        ipAddress: req.ip,
        deviceId,
      });

      logger.warn('Login falhou: senha incorreta', { email });
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos',
      });
    }

    // Atualizar último login
    user.lastLogin = new Date();
    user.lastIp = req.ip;
    user.loginHistory.push({
      timestamp: new Date(),
      ip: req.ip,
      deviceId,
      success: true,
    });

    // Manter apenas últimos 10 logins
    user.loginHistory = user.loginHistory.slice(-10);

    await user.save();

    // Registrar login bem-sucedido
    await AuditLog.create({
      action: 'login_success',
      status: 'success',
      userId: user.userId,
      email,
      description: `Login bem-sucedido`,
      ipAddress: req.ip,
      deviceId,
    });

    // Gerar token
    if (user.role !== getRoleForEmail(user.email)) {
      user.role = getRoleForEmail(user.email);
      await user.save();
    }

    const token = signToken(user);

    logger.info('Login bem-sucedido', { email, userId: user.userId });

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    logger.error('Erro no login', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: error.message,
    });
  }
};

exports.verifyToken = (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Token válido',
      user: req.user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }
};
