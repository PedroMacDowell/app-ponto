const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const PunchSchema = new mongoose.Schema(
  {
    // ID único da batida
    punchId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
      required: true,
    },
    // Referência ao usuário
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userEmail: String,
    // Tipo de batida
    type: {
      type: String,
      enum: ['entrada', 'saida', 'intervalo', 'retorno'],
      default: 'entrada',
    },
    // Timestamp da batida
    timestamp: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    // Foto base64 ou URL
    photo: {
      filename: String,
      url: String,
      data: {
        type: String,
        select: false,
      },
      size: Number,
      mimeType: String,
      // Hash da foto para detectar duplicatas
      hash: String,
    },
    // Localização
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      accuracy: Number,
      address: String,
    },
    // Metadados de Segurança
    security: {
      // Se foi capturado da câmera ou galeria
      captureMethod: {
        type: String,
        enum: ['camera', 'gallery', 'unknown'],
        default: 'camera',
      },
      // Resultado da detecção de rosto
      faceDetection: {
        detected: Boolean,
        confidence: Number,
        landmarks: Object,
      },
      // Biometria utilizada
      biometryType: {
        type: String,
        enum: ['faceid', 'fingerprint', 'pin', 'none'],
      },
      // Se passou por validação
      validated: Boolean,
      // IP do dispositivo
      deviceIp: String,
      // ID único do dispositivo
      deviceId: String,
      // Hash do dispositivo para detectar mudanças
      deviceHash: String,
    },
    // Status
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'rejected', 'duplicate'],
      default: 'pending',
    },
    // Motivo se rejeitado
    rejectionReason: String,
    // Se foi validado por admin
    adminValidation: {
      validatedBy: mongoose.Schema.Types.ObjectId,
      validatedAt: Date,
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para busca rápida
PunchSchema.index({ userId: 1, timestamp: -1 });
PunchSchema.index({ userEmail: 1, timestamp: -1 });
PunchSchema.index({ timestamp: -1 });
PunchSchema.index({ 'security.deviceId': 1, timestamp: -1 });

module.exports = mongoose.model('Punch', PunchSchema);
