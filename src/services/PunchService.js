import AsyncStorage from '@react-native-async-storage/async-storage';

const PUNCH_SEQUENCE = ['entrada', 'intervalo', 'retorno', 'saida'];

export const PunchService = {
  async recordPunch(photoData, locationData, userId) {
    try {
      const todayPunches = await this.getTodayPunches(userId);
      const type = PUNCH_SEQUENCE[todayPunches.length];

      if (!type) {
        return {
          success: false,
          error: 'Limite de 4 batidas de ponto atingido hoje',
        };
      }

      const punchRecord = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        timestamp: new Date().toISOString(),
        photo: photoData,
        location: locationData,
        type,
        status: 'confirmed',
      };

      const punchesKey = `punches_${userId}`;
      const storedPunches = await AsyncStorage.getItem(punchesKey);
      const punches = storedPunches ? JSON.parse(storedPunches) : [];
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

  calculatePendingHours() {
    const weeklyTarget = 40;
    return weeklyTarget;
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
