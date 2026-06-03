import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../services/logger/ApiService';
import { PunchService } from '../services/PunchService';

const COLUMNS = [
  { key: 'entrada', label: 'Entrada' },
  { key: 'intervalo', label: 'Almoco' },
  { key: 'retorno', label: 'Retorno' },
  { key: 'saida', label: 'Saida' },
];

const formatPunch = (punch) => {
  if (!punch) return '--:--';
  return PunchService.formatTime(punch.timestamp);
};

export const AdminDashboardScreen = () => {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAdminTodayDashboard();
      setDashboard(response);
    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Nao foi possivel carregar o RH'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const employees = dashboard?.employees || [];

  const openPhoto = (punch) => {
    if (!punch?.photo?.data) {
      Alert.alert('Foto indisponivel', 'Esta batida ainda nao tem foto salva.');
      return;
    }

    setSelectedPhoto({
      title: `${punch.type} - ${PunchService.formatTime(punch.timestamp)}`,
      uri: `data:${punch.photo.mimeType || 'image/jpeg'};base64,${punch.photo.data}`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard RH</Text>
            <Text style={styles.subtitle}>{user?.name || user?.email}</Text>
          </View>
          <Button
            title="Sair"
            onPress={handleLogout}
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryCard}>
            <MaterialIcons name="groups" size={28} color="#007AFF" />
            <Text style={styles.summaryLabel}>Funcionarios</Text>
            <Text style={styles.summaryValue}>
              {dashboard?.summary?.employees || 0}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <MaterialIcons name="login" size={28} color="#34C759" />
            <Text style={styles.summaryLabel}>Com entrada</Text>
            <Text style={styles.summaryValue}>
              {dashboard?.summary?.withEntrada || 0}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <MaterialIcons name="task-alt" size={28} color="#5856D6" />
            <Text style={styles.summaryLabel}>Completos</Text>
            <Text style={styles.summaryValue}>
              {dashboard?.summary?.completed || 0}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <MaterialIcons name="timer" size={28} color="#FF9500" />
            <Text style={styles.summaryLabel}>Horas</Text>
            <Text style={styles.summaryValue}>
              {dashboard?.summary?.workedHours || '00:00'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Text style={styles.sectionTitle}>Pontos de hoje</Text>
          <Button
            title={loading ? 'Atualizando...' : 'Atualizar'}
            onPress={loadDashboard}
            disabled={loading}
            style={styles.refreshButton}
            textStyle={styles.refreshButtonText}
          />
        </View>

        {employees.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {loading
                ? 'Carregando funcionarios...'
                : 'Nenhum funcionario encontrado'}
            </Text>
          </View>
        ) : (
          employees.map((item) => (
            <View key={item.user._id || item.user.userId} style={styles.rowCard}>
              <View style={styles.employeeHeader}>
                <View>
                  <Text style={styles.employeeName}>{item.user.name}</Text>
                  <Text style={styles.employeeEmail}>{item.user.email}</Text>
                </View>
                <Text
                  style={[
                    styles.statusBadge,
                    item.completed && styles.statusBadgeDone,
                  ]}
                >
                  {item.completed ? 'Completo' : 'Em aberto'}
                </Text>
              </View>

              <View style={styles.punchGrid}>
                {COLUMNS.map((column) => (
                  <TouchableOpacity
                    key={column.key}
                    style={styles.punchCell}
                    onPress={() => openPhoto(item.byType[column.key])}
                    disabled={!item.byType[column.key]}
                  >
                    <Text style={styles.punchLabel}>{column.label}</Text>
                    <Text style={styles.punchValue}>
                      {formatPunch(item.byType[column.key])}
                    </Text>
                    {item.byType[column.key]?.photo?.data && (
                      <MaterialIcons
                        name="photo-camera"
                        size={14}
                        color="#007AFF"
                        style={styles.photoIcon}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total trabalhado</Text>
                <Text style={styles.totalValue}>{item.workedHours}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={Boolean(selectedPhoto)} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedPhoto?.title}</Text>
            {selectedPhoto?.uri && (
              <Image
                source={{ uri: selectedPhoto.uri }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            )}
            <Button
              title="Fechar"
              onPress={() => setSelectedPhoto(null)}
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#111827',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 13,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutButtonText: {
    fontSize: 12,
  },
  summary: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#666',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  summaryValue: {
    color: '#111',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  actions: {
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#111',
    fontSize: 18,
    fontWeight: '700',
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
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#777',
    fontSize: 14,
  },
  rowCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  employeeName: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
  employeeEmail: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3CD',
    borderRadius: 6,
    color: '#8A5A00',
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBadgeDone: {
    backgroundColor: '#E8F7EF',
    color: '#1F7A3F',
  },
  punchGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  punchCell: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 8,
    minHeight: 66,
  },
  punchLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
  },
  punchValue: {
    color: '#111',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  photoIcon: {
    marginTop: 4,
  },
  totalRow: {
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
  },
  totalLabel: {
    color: '#555',
    fontSize: 13,
    fontWeight: '700',
  },
  totalValue: {
    color: '#111',
    fontSize: 15,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    color: '#111',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  modalImage: {
    backgroundColor: '#eee',
    borderRadius: 8,
    height: 420,
    width: '100%',
  },
  closeButton: {
    marginTop: 14,
  },
});
