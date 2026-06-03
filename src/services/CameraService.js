import * as FileSystem from 'expo-file-system';

export const CameraService = {
  async takePunchPhoto(cameraRef) {
    try {
      const camera = cameraRef?.current || cameraRef;
      if (!camera) return null;

      const photo = await this.captureWithRetry(camera);

      const base64 =
        photo.base64 ||
        (photo.uri
          ? await FileSystem.readAsStringAsync(photo.uri, {
              encoding: FileSystem.EncodingType.Base64,
            })
          : null);

      return {
        uri: photo.uri,
        base64,
        timestamp: new Date().toISOString(),
        type: 'image/jpeg',
      };
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      return null;
    }
  },

  async captureWithRetry(camera) {
    try {
      return await camera.takePictureAsync({
        quality: 0.7,
        base64: true,
        exif: false,
      });
    } catch (error) {
      console.warn('Primeira captura falhou, tentando novamente:', error);

      await new Promise((resolve) => setTimeout(resolve, 800));

      return await camera.takePictureAsync({
        quality: 0.5,
        base64: false,
        exif: false,
      });
    }
  },

  async savePhoto(photoUri, filename) {
    try {
      const filename_to_save = `${FileSystem.documentDirectory}${filename}.jpg`;
      await FileSystem.copyAsync({
        from: photoUri,
        to: filename_to_save,
      });
      return filename_to_save;
    } catch (error) {
      console.error('Erro ao salvar foto:', error);
      return null;
    }
  },

  resizeImage(base64, width = 640, height = 480) {
    // Simulação de redimensionamento
    return base64;
  },
};
