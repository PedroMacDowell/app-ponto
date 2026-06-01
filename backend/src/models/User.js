const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema(
  {
    // ID único do usuário
    userId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      match: /.+\@.+\..+/,
    },
    // Senha com hash bcrypt
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Não retorna por padrão
    },
    company: {
      type: String,
      default: 'Empresa Demo',
    },
    department: {
      type: String,
      default: 'Geral',
    },
    // Metadados do dispositivo
    deviceInfo: {
      deviceId: String,
      deviceName: String,
      osVersion: String,
      appVersion: String,
    },
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    // Último login
    lastLogin: Date,
    // IP do último acesso
    lastIp: String,
    // Histórico de logins para segurança
    loginHistory: [
      {
        timestamp: Date,
        ip: String,
        deviceId: String,
        success: Boolean,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash da senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS || 10));
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para retornar dados seguros do usuário
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.loginHistory;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
