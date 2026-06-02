import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiService } from '../services/logger/ApiService';
import { USE_API } from '../config/api';

const AuthContext = createContext({});

const normalizeUser = (userData) => {
  if (!userData) return null;

  return {
    ...userData,
    id: userData.id || userData._id || userData.userId,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      if (userToken && userData) {
        if (!USE_API) {
          setUser(normalizeUser(JSON.parse(userData)));
          return;
        }

        try {
          await ApiService.verifyToken();
          setUser(normalizeUser(JSON.parse(userData)));
        } catch (error) {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userData');
          setUser(null);
        }
      }
    } catch (e) {
      console.error('Failed to restore user session', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      if (!USE_API) {
        const userData = {
          id: email.toLowerCase(),
          email,
          name: email.split('@')[0],
          company: 'Empresa Demo',
        };

        await AsyncStorage.setItem('userToken', `local_${userData.id}`);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);

        return { success: true };
      }

      const response = await ApiService.login(email, password);
      const userData = normalizeUser(response.user);

      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        return { success: false, error: 'Senhas nao coincidem' };
      }

      if (!USE_API) {
        const userData = {
          id: email.toLowerCase(),
          email,
          name,
          company: 'Empresa Demo',
        };

        await AsyncStorage.setItem('userToken', `local_${userData.id}`);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);

        return { success: true };
      }

      const response = await ApiService.register(
        name,
        email,
        password,
        confirmPassword
      );
      const userData = normalizeUser(response.user);

      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const authContext = {
    user,
    loading,
    login,
    register,
    logout,
    isSignedIn: user !== null,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
