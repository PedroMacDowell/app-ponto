import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { PunchCard } from '../components/PunchCard';
import { PunchService } from '../services/PunchService';
import { ApiService } from '../services/logger/ApiService';
import { LocationService } from '../services/LocationService';
import { USE_API } from '../config/api';

const getPunchByType = (punches, type) => {
  return punches.find((punch) => punch.type === type);
};

const calculateWorkedMs = (punches) => {
  const entrada = getPunchByType(punches, 'entrada');
  const intervalo = getPunchByType(punches, 'intervalo');
  const retorno = getPunchByType(punches, 'retorno');
  const saida = getPunchByType(punches, 'saida');

  let total = 0;

  if (entrada && intervalo) {
    total += new Date(intervalo.timestamp) - new Date(entrada.timestamp);
  }

  if (retorno && saida) {
    total += new Date(saida.timestamp) - new Date(retorno.timestamp);
  }

  return Math.max(0, total);
};

const formatDuration = (durationMs) => {
  const totalMinutes = Math.floor(durationMs / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [todayPunches, setTodayPunches] = useState([]);
  const [pendingHours, setPendingHours] = useState(40);
  const [workedToday, setWorkedToday] = useState('00:00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const unsubscribe = navigation.addListener('focus', loadDashboardData);
    return unsubscribe;
  }, [navigation]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const punches = USE_API
        ? (await ApiService.getTodayPunches()).data || []
        : await PunchService.getTodayPunches(user.id);
      const workedMs = calculateWorkedMs(punches);
      const workedHours = Math.floor(workedMs / 1000 / 60 / 60);

      setTodayPunches(punches);
      setPendingHours(Math.max(0, 40 - workedHours));
      setWorkedToday(formatDuration(workedMs));
    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Nao foi possivel carregar os pontos'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirmar Logout',
      'Deseja realmente fazer logout?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Ola, {user?.name}!</Text>
            <Text style={styles.company}>{user?.company}</Text>
          </View>
          <Button
            title="Sair"
            onPress={handleLogout}
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="schedule" size={32} color="#007AFF" />
            <Text style={styles.statLabel}>Trabalhadas Hoje</Text>
            <Text style={styles.statValue}>{workedToday}</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="check-circle" size={32} color="#34C759" />
            <Text style={styles.statLabel}>Batidas Hoje</Text>
            <Text style={styles.statValue}>{todayPunches.length}</Text>
          </View>
        </View>

        <View style={styles.punchButtonContainer}>
          <Button
            title="BATER PONTO"
            onPress={() => navigation.navigate('PunchCamera')}
            style={styles.punchButton}
            textStyle={styles.punchButtonText}
          />
          <Text style={styles.punchSubtitle}>
            Foto + Localizacao + Horario
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Batidas de Hoje</Text>
            <Button
              title="Atualizar"
              onPress={loadDashboardData}
              disabled={loading}
              style={styles.refreshButton}
              textStyle={styles.refreshButtonText}
            />
          </View>

          {todayPunches.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {loading
                  ? 'Carregando pontos...'
                  : 'Nenhuma batida registrada ainda'}
              </Text>
            </View>
          ) : (
            todayPunches.map((punch) => (
              <PunchCard
                key={punch._id || punch.punchId}
                time={PunchService.formatTime(punch.timestamp)}
                type={punch.type}
                location={LocationService.formatLocation(punch.location)}
                photo={punch.photo}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Semanal</Text>
          <View style={styles.weeklyCard}>
            <View style={styles.weeklyRow}>
              <Text style={styles.weeklyLabel}>Meta Semanal:</Text>
              <Text style={styles.weeklyValue}>40h</Text>
            </View>
            <View style={styles.weeklyRow}>
              <Text style={styles.weeklyLabel}>Trabalhadas:</Text>
              <Text style={styles.weeklyValue}>{workedToday}</Text>
            </View>
            <View style={styles.weeklyRow}>
              <Text style={styles.weeklyLabel}>Pendentes:</Text>
              <Text style={[styles.weeklyValue, { color: '#FF3B30' }]}>
                {pendingHours}h
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  company: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutButtonText: {
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  punchButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  punchButton: {
    width: '100%',
    paddingVertical: 18,
    backgroundColor: '#34C759',
  },
  punchButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  punchSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  refreshButtonText: {
    fontSize: 12,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
  },
  weeklyCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  weeklyLabel: {
    fontSize: 14,
    color: '#666',
  },
  weeklyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
});
