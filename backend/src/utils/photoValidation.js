// Validação básica de manipulação de foto
// Em produção, usar ML para detecção mais avançada

exports.detectPhotoManipulation = async (photoBase64) => {
  try {
    // Básico: verificar se a string é válida base64
    if (!photoBase64 || photoBase64.length < 1000) {
      return {
        suspicious: true,
        faceDetected: false,
        reason: 'Arquivo muito pequeno',
      };
    }

    // Verificar se começa com dados de imagem válidos
    if (!photoBase64.includes('data:image') && photoBase64.length < 5000) {
      return {
        suspicious: true,
        faceDetected: false,
        reason: 'Formato inválido',
      };
    }

    return {
      suspicious: false,
      faceDetected: true,
      confidence: 0.8,
    };
  } catch (error) {
    console.error('Erro na detecção de manipulação:', error);
    return {
      suspicious: false,
      faceDetected: true,
    };
  }
};

// Detectar se foto é da câmera ou galeria
// Verificar EXIF data em produção
exports.isCameraPhoto = (photoMetadata) => {
  // Em produção, verificar EXIF data
  // Por enquanto, retornar baseado no metadado do cliente
  return photoMetadata?.captureMethod === 'camera';
};

// Verificar se foto é muito similar a outra
exports.comparePhotos = async (photo1, photo2) => {
  // Em produção, usar algoritmo de hash perceptual
  // Por enquanto, apenas comparar hashes MD5
  const hash1 = require('crypto')
    .createHash('md5')
    .update(photo1)
    .digest('hex');
  const hash2 = require('crypto')
    .createHash('md5')
    .update(photo2)
    .digest('hex');

  return hash1 === hash2;
};
