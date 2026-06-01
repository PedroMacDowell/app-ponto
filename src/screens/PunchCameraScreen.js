import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { CameraView } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { LocationService } from '../services/LocationService';
import { CameraService } from '../services/CameraService';
import { BiometricService } from '../services/BiometricService';
import { PunchService } from '../services/PunchService';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const PunchCameraScreen = ({ navigation }) => {
  const { user } = useAuth();
  const cameraRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [step, setStep] = useState('ready'); // ready, loading, preview

  useEffect(() => {
    checkBiometricAvailability();
    requestLocationPermission();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await BiometricService.isBiometricAvailable();
    setBiometricAvailable(available);
  };

  const requestLocationPermission = async () => {
    const location = await LocationService.getCurrentLocation();
    if (location) {
      setLocationData(location);
    } else {
      Alert.alert(
        'Aviso',
        'Não foi possível obter sua localização. Tente novamente.'
      );
    }
  };

  const handleTakePunchPhoto = async () => {
    if (!cameraRef.current) return;

    try {
      setLoading(true);

      // Autenticação Biométrica
      if (biometricAvailable) {
        const authenticated = await BiometricService.authenticate();
        if (!authenticated) {
          Alert.alert('Erro', 'Autenticação biométrica falhou');
          setLoading(false);
          return;
        }
      }

      // Obter Localização Atual
      const currentLocation = await LocationService.getCurrentLocation();
      if (!currentLocation) {
        Alert.alert('Erro', 'Não foi possível obter a localização');
        setLoading(false);
        return;
      }

      // Capturar Foto
      const photoData = await CameraService.takePunchPhoto(cameraRef);
      if (!photoData) {
        Alert.alert('Erro', 'Não foi possível capturar a foto');
        setLoading(false);
        return;
      }

      // Salvar Batida de Ponto
      const result = await PunchService.recordPunch(
        photoData,
        currentLocation,
        user.id
      );

      setLoading(false);

      if (result.success) {
        Alert.alert(
          'Sucesso!',
          'Ponto batido com sucesso!\n\n' +
            `Horário: ${PunchService.formatTime(result.data.timestamp)}\n` +
            `Local: ${result.data.location.latitude.toFixed(4)}, ${result.data.location.longitude.toFixed(4)}`,
          [
            {
              text: 'Voltar para Dashboard',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Erro', result.error || 'Falha ao bater ponto');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro', 'Algo deu errado: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="← Voltar"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          textStyle={styles.backButtonText}
        />
        <Text style={styles.title}>Bater Ponto</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          onCameraReady={() => setCameraReady(true)}
          facing="front"
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.faceDetectionCircle}>
              <Text style={styles.instructionText}>
                Posicione seu rosto na área
              </Text>
            </View>
          </View>
        </CameraView>
      </View>

      {/* Location Info */}
      {locationData && (
        <View style={styles.locationInfo}>
          <MaterialIcons name="location-on" size={20} color="#34C759" />
          <Text style={styles.locationText}>
            📍 {LocationService.formatCoordinates(
              locationData.latitude,
              locationData.longitude
            )}
          </Text>
        </View>
      )}

      {/* Info Cards */}
      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <MaterialIcons name="schedule" size={24} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Horário</Text>
            <Text style={styles.infoValue}>
              {new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <MaterialIcons
            name={biometricAvailable ? 'verified-user' : 'warning'}
            size={24}
            color={biometricAvailable ? '#34C759' : '#FF9500'}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Biometria</Text>
            <Text style={styles.infoValue}>
              {biometricAvailable ? 'Ativada' : 'Não Disponível'}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <Button
          title="📸 CONFIRMAR PONTO"
          onPress={handleTakePunchPhoto}
          disabled={!cameraReady || loading}
          style={styles.actionButton}
          textStyle={styles.actionButtonText}
        />
      </View>

      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 12,
    color: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  faceDetectionCircle: {
    width: 200,
    height: 240,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#34C759',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12,
  },
  instructionText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  locationInfo: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  infoSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 12,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: 2,
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  actionButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
