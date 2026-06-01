const crypto = require('crypto');
const Punch = require('../models/Punch');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const logger = require('../utils/logger');
const { detectPhotoManipulation } = require('../utils/photoValidation');

// Gerar hash MD5 da foto para detectar duplicatas
const generatePhotoHash = (photoData) => {
  return crypto
    .createHash('md5')
    .update(photoData)
    .digest('hex');
};

exports.createPunch = async (req, res) => {
  try {
    const {
      photoBase64,
      location,
      type = 'entrada',
      biometryType,
      deviceId,
      captureMethod,
    } = req.body;

    if (!photoBase64 || !location) {
      return res.status(400).json({
        success: false,
        message: 'Foto e localização são obrigatórias',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Gerar hash da foto
    const photoHash = generatePhotoHash(photoBase64);

    // Verificar se já existe punch com essa foto (duplicata)
    const isDuplicate = await Punch.findOne({
      userId: req.user.id,
      'photo.hash': photoHash,
      timestamp: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24h
      },
    });

    if (isDuplicate) {
      await AuditLog.create({
        action: 'duplicate_detected',
        status: 'warning',
        userId: user.userId,
        email: user.email,
        description: 'Tentativa de batida de ponto duplicada detectada',
        ipAddress: req.ip,
        deviceId,
      });

      logger.warn('Duplicata de foto detectada', {
        userId: user.userId,
        photoHash,
      });

      return res.status(400).json({
        success: false,
        message: 'Você já bateu ponto com essa foto recentemente',
        isDuplicate: true,
      });
    }

    // Detectar manipulação de foto (simples validação)
    const manipulationCheck = await detectPhotoManipulation(photoBase64);

    // Criar batida de ponto
    const punch = await Punch.create({
      userId: req.user.id,
      userEmail: user.email,
      type,
      photo: {
        filename: `punch_${user.userId}_${Date.now()}.jpg`,
        hash: photoHash,
        size: photoBase64.length,
        mimeType: 'image/jpeg',
      },
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
      },
      security: {
        captureMethod: captureMethod || 'camera',
        faceDetection: manipulationCheck.faceDetected,
        biometryType,
        validated: !manipulationCheck.suspicious,
        deviceId,
        deviceHash: generatePhotoHash(deviceId),
      },
      status: manipulationCheck.suspicious ? 'pending' : 'confirmed',
    });

    // Registrar na auditoria
    await AuditLog.create({
      action: 'punch_created',
      status: 'success',
      userId: user.userId,
      email: user.email,
      description: `Ponto batido - Tipo: ${type}`,
      data: {
        punchId: punch.punchId,
        location,
        captureMethod,
      },
      ipAddress: req.ip,
      deviceId,
    });

    logger.info('Ponto criado com sucesso', {
      userId: user.userId,
      punchId: punch.punchId,
      type,
    });

    res.status(201).json({
      success: true,
      message: 'Ponto batido com sucesso',
      punch: {
        id: punch._id,
        punchId: punch.punchId,
        timestamp: punch.timestamp,
        type: punch.type,
        status: punch.status,
      },
    });
  } catch (error) {
    logger.error('Erro ao criar ponto', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Erro ao bater ponto',
      error: error.message,
    });
  }
};

exports.getTodayPunches = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const punches = await Punch.find({
      userId: req.user.id,
      timestamp: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: punches,
    });
  } catch (error) {
    logger.error('Erro ao buscar pontos do dia', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pontos',
      error: error.message,
    });
  }
};

exports.getPunchHistory = async (req, res) => {
  try {
    const { startDate, endDate, limit = 30, offset = 0 } = req.query;

    let filter = { userId: req.user.id };

    if (startDate && endDate) {
      filter.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const punches = await Punch.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Punch.countDocuments(filter);

    res.json({
      success: true,
      data: punches,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    logger.error('Erro ao buscar histórico', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar histórico',
      error: error.message,
    });
  }
};
