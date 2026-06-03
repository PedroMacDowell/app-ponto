import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const TYPE_LABELS = {
  entrada: 'Entrada',
  intervalo: 'Intervalo',
  retorno: 'Retorno',
  saida: 'Saida',
};

export const PunchCard = ({ time, type, location, photo, onDelete }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.time}>{time}</Text>
          {type && <Text style={styles.badge}>{TYPE_LABELS[type] || type}</Text>}
        </View>
        <Text style={styles.location}>{location}</Text>
      </View>
      {onDelete && (
        <TouchableOpacity onPress={onDelete}>
          <MaterialIcons name="delete" size={24} color="#FF3B30" />
        </TouchableOpacity>
      )}
    </View>
    {photo && (
      <View style={styles.photoContainer}>
        <Text style={styles.photoPlaceholder}>Foto capturada</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  badge: {
    backgroundColor: '#E8F2FF',
    borderRadius: 6,
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  photoContainer: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    alignItems: 'center',
  },
  photoPlaceholder: {
    fontSize: 14,
    color: '#666',
  },
});
