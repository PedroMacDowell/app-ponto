import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { LocalLogger } from './LocalLogger';
import { API_BASE_URL } from '../../config/api';

const getDeviceInfo = () => ({
  deviceId:
    Application.androidId ||
    Application.applicationId ||
    Application.nativeApplicationVersion ||
    'unknown-device',
  deviceName: Application.applicationName || 'unknown-app',
  osVersion: Application.nativeBuildVersion || 'unknown-version',
  appVersion: Application.nativeApplicationVersion || 'unknown-version',
});

// Criar instância do axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para adicionar token nas requisições
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao adicionar token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

export const ApiService = {
  async register(name, email, password, confirmPassword) {
    try {
      const deviceInfo = getDeviceInfo();

      const response = await apiClient.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword,
        ...deviceInfo,
      });

      await LocalLogger.log('AUTH', 'Registro bem-sucedido', {
        email,
        userId: response.data.user.userId,
      });

      return response.data;
    } catch (error) {
      await LocalLogger.log('AUTH', 'Erro no registro', {
        email,
        error: error.response?.data?.message || error.message,
      });
      throw error;
    }
  },

  async login(email, password) {
    try {
      const deviceInfo = getDeviceInfo();

      const response = await apiClient.post('/auth/login', {
        email,
        password,
        ...deviceInfo,
      });

      await LocalLogger.log('AUTH', 'Login bem-sucedido', {
        email,
        userId: response.data.user.userId,
      });

      return response.data;
    } catch (error) {
      await LocalLogger.log('AUTH', 'Erro no login', {
        email,
        error: error.response?.data?.message || error.message,
      });
      throw error;
    }
  },

  async verifyToken() {
    try {
      const response = await apiClient.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createPunch(photoBase64, location, type = 'entrada', biometryType) {
    try {
      const deviceInfo = getDeviceInfo();

      const response = await apiClient.post('/punch', {
        photoBase64,
        location,
        type,
        biometryType,
        captureMethod: 'camera',
        ...deviceInfo,
      });

      await LocalLogger.log('PUNCHES', 'Ponto batido com sucesso', {
        punchId: response.data.punch.punchId,
        type,
        timestamp: response.data.punch.timestamp,
      });

      return response.data;
    } catch (error) {
      await LocalLogger.log('PUNCHES', 'Erro ao bater ponto', {
        error: error.response?.data?.message || error.message,
        type,
      });
      throw error;
    }
  },

  async getTodayPunches() {
    try {
      const response = await apiClient.get('/punch/today');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter punches de hoje:', error);
      throw error;
    }
  },

  async getPunchHistory(startDate, endDate, limit = 30, offset = 0) {
    try {
      const response = await apiClient.get('/punch/history', {
        params: {
          startDate,
          endDate,
          limit,
          offset,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      throw error;
    }
  },

  async checkDuplicate(photoHash) {
    try {
      const response = await apiClient.post('/punch/check-duplicate', {
        photoHash,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar duplicata:', error);
      return { isDuplicate: false };
    }
  },

  async getAdminTodayDashboard() {
    try {
      const response = await apiClient.get('/admin/dashboard/today');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dashboard admin:', error);
      throw error;
    }
  },
};
