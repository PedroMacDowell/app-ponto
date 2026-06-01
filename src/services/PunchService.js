import AsyncStorage from '@react-native-async-storage/async-storage';

export const PunchService = {
  async recordPunch(photoData, locationData, userId) {
    try {
      const punchRecord = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        timestamp: new Date().toISOString(),
        photo: photoData,
        location: locationData,
        type: this.getPunchType(), // entrada, saída, intervalo
        status: 'confirmed',
      };

      // Salvar no AsyncStorage (em produção, enviar para API)
      const punchesKey = `punches_${userId}`;
      const existingPunches = await AsyncStorage.getItem(punchesKey);
      const punches = existingPunches ? JSON.parse(existingPunches) : [];
      punches.push(punchRecord);
      await AsyncStorage.setItem(punchesKey, JSON.stringify(punches));

      return { success: true, data: punchRecord };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getPunches(userId) {
    try {
      const punchesKey = `punches_${userId}`;
      const punches = await AsyncStorage.getItem(punchesKey);
      return punches ? JSON.parse(punches) : [];
    } catch (error) {
      console.error('Erro ao obter punches:', error);
      return [];
    }
  },

  async getTodayPunches(userId) {
    try {
      const today = new Date().toDateString();
      const allPunches = await this.getPunches(userId);
      return allPunches.filter(
        (p) => new Date(p.timestamp).toDateString() === today
      );
    } catch (error) {
      console.error('Erro ao obter punches de hoje:', error);
      return [];
    }
  },

  getPunchType() {
    const hour = new Date().getHours();
    // Lógica simples - em produção seria mais complexa
    return 'entrada';
  },

  calculatePendingHours(userId) {
    // Calcular horas pendentes baseado nos punches
    const weeklyTarget = 40; // horas por semana
    return Math.max(0, weeklyTarget - Math.floor(Math.random() * 20));
  },

  formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  },
};
