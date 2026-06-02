import crypto from 'crypto';

// Serviço para validação e segurança de fotos
export const PhotoSecurityService = {
  // Gerar hash MD5 da foto
  generatePhotoHash(photoBase64) {
    try {
      const data = photoBase64.replace(/^data:image\/\w+;base64,/, '');
      return crypto
        .createHash('md5')
        .update(data)
        .digest('hex');
    } catch (error) {
      console.error('Erro ao gerar hash da foto:', error);
      return null;
    }
  },

  // Verificar se a foto é de câmera (EXIF data)
  async isCameraPhoto(photoMetadata, captureMethod) {
    // Em um app real, verificar EXIF data
    // Por enquanto, confiar no método de captura do cliente
    return captureMethod === 'camera' && photoMetadata?.faceDetected;
  },

  // Validar tamanho da foto
  isValidPhotoSize(photoBase64) {
    const minSize = 10000; // 10KB
    const maxSize = 5000000; // 5MB

    const size = photoBase64.length;
    return size >= minSize && size <= maxSize;
  },

  // Validar formato da foto
  isValidPhotoFormat(photoBase64) {
    // Verificar se é JPEG válido
    return photoBase64.includes('data:image/jpeg') || photoBase64.startsWith('iVBOR');
  },

  // Análise básica de manipulação
  async detectManipulation(photoBase64) {
    try {
      const checks = {
        validSize: this.isValidPhotoSize(photoBase64),
        validFormat: this.isValidPhotoFormat(photoBase64),
        minComplexity: photoBase64.length > 50000, // Foto com mínima complexidade
      };

      const suspicious =
        !checks.validSize || !checks.validFormat || !checks.minComplexity;

      return {
        suspicious,
        checks,
        confidence: this.calculateConfidence(checks),
      };
    } catch (error) {
      console.error('Erro na detecção de manipulação:', error);
      return {
        suspicious: false,
        checks: {},
        confidence: 0.5,
      };
    }
  },

  // Calcular confiança (0-1)
  calculateConfidence(checks) {
    const passedChecks = Object.values(checks).filter((v) => v).length;
    const totalChecks = Object.keys(checks).length;
    return totalChecks > 0 ? passedChecks / totalChecks : 0.5;
  },

  // Comparar duas fotos (hash)
  comparePhotos(hash1, hash2) {
    return hash1 === hash2;
  },

  // Gerar ID único para dispositivo
  async generateDeviceId() {
    // Em app real, usar expo-device ou outro
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};
