import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from './LoginScreen';
import { DashboardScreen } from './DashboardScreen';

export const SplashScreen = ({ loading }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);
