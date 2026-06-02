import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

// Sistema de logging local completo
export const LocalLogger = {
  LOG_KEYS: {
    PUNCHES: 'app_punch_logs',
    AUTH: 'app_auth_logs',
    ERRORS: 'app_error_logs',
    DEVICE: 'app_device_logs',
  },

  async log(type, message, data = {}) {
    try {
      const timestamp = new Date().toISOString();
      const logEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp,
        type,
        message,
        data,
      };

      const key = this.LOG_KEYS[type] || 'app_general_logs';
      const existingLogs = await AsyncStorage.getItem(key);
      const logs = existingLogs ? JSON.parse(existingLogs) : [];

      // Manter apenas últimos 100 logs
      logs.push(logEntry);
      if (logs.length > 100) {
        logs.shift();
      }

      await AsyncStorage.setItem(key, JSON.stringify(logs));

      // Log no console para debug
      console.log(`[${type}] ${message}`, data);

      return logEntry.id;
    } catch (error) {
      console.error('Erro ao fazer log local:', error);
    }
  },

  async getPunchLogs() {
    try {
      const logs = await AsyncStorage.getItem(this.LOG_KEYS.PUNCHES);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Erro ao obter logs de ponto:', error);
      return [];
    }
  },

  async getAuthLogs() {
    try {
      const logs = await AsyncStorage.getItem(this.LOG_KEYS.AUTH);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Erro ao obter logs de auth:', error);
      return [];
    }
  },

  async getErrorLogs() {
    try {
      const logs = await AsyncStorage.getItem(this.LOG_KEYS.ERRORS);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Erro ao obter logs de erro:', error);
      return [];
    }
  },

  async exportLogs() {
    try {
      const punchLogs = await this.getPunchLogs();
      const authLogs = await this.getAuthLogs();
      const errorLogs = await this.getErrorLogs();

      const allLogs = {
        exportDate: new Date().toISOString(),
        punchLogs,
        authLogs,
        errorLogs,
      };

      const filename = `app-ponto-logs-${Date.now()}.json`;
      const path = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(path, JSON.stringify(allLogs, null, 2));

      return path;
    } catch (error) {
      console.error('Erro ao exportar logs:', error);
      return null;
    }
  },

  async clearAllLogs() {
    try {
      await AsyncStorage.removeItem(this.LOG_KEYS.PUNCHES);
      await AsyncStorage.removeItem(this.LOG_KEYS.AUTH);
      await AsyncStorage.removeItem(this.LOG_KEYS.ERRORS);
      console.log('Todos os logs foram limpos');
    } catch (error) {
      console.error('Erro ao limpar logs:', error);
    }
  },
};
