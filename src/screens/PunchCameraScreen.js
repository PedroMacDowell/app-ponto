import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { LocationService } from '../services/LocationService';
import { CameraService } from '../services/CameraService';
import { BiometricService } from '../services/BiometricService';
import { PunchService } from '../services/PunchService';
import { ApiService } from '../services/logger/ApiService';
import { USE_API } from '../config/api';
import { LoadingOverlay } from '../components/LoadingOverlay';

const PUNCH_TYPE_LABELS = {
  entrada: 'Entrada',
  intervalo: 'Intervalo',
  retorno: 'Retorno',
  saida: 'Saida',
};

export const PunchCameraScreen = ({ navigation }) => {
  const { user } = useAuth();
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    requestCameraPermission();
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
        'Nao foi possivel obter sua localizacao. Tente novamente.'
      );
    }
  };

  const handleTakePunchPhoto = async () => {
    if (!cameraRef.current) return;

    try {
      setLoading(true);

      const currentLocation = await LocationService.getCurrentLocation();
      if (!currentLocation) {
        Alert.alert('Erro', 'Nao foi possivel obter a localizacao');
        setLoading(false);
        return;
      }

      const photoData = await CameraService.takePunchPhoto(cameraRef);
      if (!photoData?.base64) {
        Alert.alert('Erro', 'Nao foi possivel capturar a foto');
        setLoading(false);
        return;
      }

      if (biometricAvailable) {
        const authenticated = await BiometricService.authenticate();
        if (!authenticated) {
          Alert.alert('Erro', 'Autenticacao biometrica falhou');
          setLoading(false);
          return;
        }
      }

      const result = USE_API
        ? await ApiService.createPunch(
            photoData.base64,
            currentLocation,
            undefined,
            biometricAvailable ? 'faceid' : 'none'
          )
        : await PunchService.recordPunch(photoData, currentLocation, user.id);

      setLoading(false);

      if (result.success) {
        const punchType = USE_API ? result.punch.type : result.data.type;

        Alert.alert(
          'Sucesso!',
          'Ponto batido com sucesso!\n\n' +
            `Tipo: ${PUNCH_TYPE_LABELS[punchType] || punchType}\n` +
            `Horario: ${PunchService.formatTime(
              USE_API ? result.punch.timestamp : result.data.timestamp
            )}\n` +
            `Local: ${LocationService.formatLocation(currentLocation)}`,
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
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Algo deu errado: ' + error.message
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="< Voltar"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          textStyle={styles.backButtonText}
        />
        <Text style={styles.title}>Bater Ponto</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.cameraContainer}>
        {cameraPermission?.granted ? (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            onCameraReady={() => setCameraReady(true)}
            facing="front"
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.faceDetectionCircle}>
                <Text style={styles.instructionText}>
                  Posicione seu rosto na area
                </Text>
              </View>
            </View>
          </CameraView>
        ) : (
          <View style={styles.permissionState}>
            <MaterialIcons name="photo-camera" size={36} color="#fff" />
            <Text style={styles.permissionText}>
              Permita acesso a camera para bater ponto
            </Text>
            <Button
              title="Permitir camera"
              onPress={requestCameraPermission}
              style={styles.permissionButton}
            />
          </View>
        )}
      </View>

      {locationData && (
        <View style={styles.locationInfo}>
          <MaterialIcons name="location-on" size={20} color="#34C759" />
          <Text style={styles.locationText}>
            {LocationService.formatLocation(locationData)}
          </Text>
        </View>
      )}

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <MaterialIcons name="schedule" size={24} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Horario</Text>
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
              {biometricAvailable ? 'Ativada' : 'Nao Disponivel'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <Button
          title="CONFIRMAR PONTO"
          onPress={handleTakePunchPhoto}
          disabled={!cameraPermission?.granted || !cameraReady || loading}
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
  permissionState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  permissionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
