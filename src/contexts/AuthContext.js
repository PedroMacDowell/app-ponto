import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

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
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.error('Failed to restore user session', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Simulação de login - substituir por chamada API real
      const userData = {
        id: Math.random().toString(),
        email,
        name: email.split('@')[0],
        company: 'Empresa Demo',
      };

      await AsyncStorage.setItem('userToken', 'token_' + userData.id);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        return { success: false, error: 'Senhas não coincidem' };
      }

      // Simulação de registro - substituir por chamada API real
      const userData = {
        id: Math.random().toString(),
        email,
        name,
        company: 'Empresa Demo',
      };

      await AsyncStorage.setItem('userToken', 'token_' + userData.id);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
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
