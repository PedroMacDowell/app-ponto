import * as LocalAuthentication from 'expo-local-authentication';

export const BiometricService = {
  async isBiometricAvailable() {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return compatible && enrolled;
    } catch (error) {
      console.error('Erro ao verificar biometria:', error);
      return false;
    }
  },

  async authenticate() {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
        reason: 'Autentique-se para confirmar a batida de ponto',
      });
      return result.success;
    } catch (error) {
      console.error('Erro na autenticação biométrica:', error);
      return false;
    }
  },

  async getSupportedTypes() {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      return types;
    } catch (error) {
      console.error('Erro ao obter tipos de autenticação:', error);
      return [];
    }
  },
};
