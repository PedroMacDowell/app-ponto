const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const AuditLogSchema = new mongoose.Schema(
  {
    // ID único do log
    logId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    // Usuário que fez a ação
    userId: String,
    email: String,
    // Tipo de ação
    action: {
      type: String,
      enum: [
        'login_success',
        'login_failed',
        'punch_created',
        'punch_updated',
        'punch_rejected',
        'user_created',
        'user_updated',
        'suspicious_activity',
        'duplicate_detected',
      ],
      required: true,
    },
    // Descrição detalhada
    description: String,
    // Dados envolvidos
    data: mongoose.Schema.Types.Mixed,
    // Status
    status: {
      type: String,
      enum: ['success', 'warning', 'error'],
      default: 'success',
    },
    // IP do cliente
    ipAddress: String,
    // Dispositivo
    deviceId: String,
    // User agent
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Índices
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });
AuditLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
