import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export const CameraService = {
  async takePunchPhoto(cameraRef) {
    try {
      if (!cameraRef) return null;

      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
        base64: true,
        skipProcessing: true,
      });

      return {
        uri: photo.uri,
        base64: photo.base64,
        timestamp: new Date().toISOString(),
        type: 'image/jpeg',
      };
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      return null;
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
