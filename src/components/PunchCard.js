import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const PunchCard = ({ time, location, photo, onDelete }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.location}>📍 {location}</Text>
      </View>
      {onDelete && (
        <TouchableOpacity onPress={onDelete}>
          <MaterialIcons name="delete" size={24} color="#FF3B30" />
        </TouchableOpacity>
      )}
    </View>
    {photo && (
      <View style={styles.photoContainer}>
        <Text style={styles.photoPlaceholder}>📸 Foto capturada</Text>
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
  time: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
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
