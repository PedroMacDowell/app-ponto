const User = require('../models/User');
const Punch = require('../models/Punch');
const logger = require('../utils/logger');

const PUNCH_TYPES = ['entrada', 'intervalo', 'retorno', 'saida'];

const getDayRange = () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};

exports.getTodayDashboard = async (req, res) => {
  try {
    const { startOfDay, endOfDay } = getDayRange();

    const users = await User.find({
      isActive: true,
      $or: [{ role: 'employee' }, { role: { $exists: false } }],
    })
      .select('name email company department userId')
      .sort({ name: 1 });

    const punches = await Punch.find({
      timestamp: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ timestamp: 1 });

    const punchesByUserId = punches.reduce((acc, punch) => {
      const key = punch.userId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(punch);
      return acc;
    }, {});

    const employees = users.map((user) => {
      const userPunches = punchesByUserId[user._id.toString()] || [];
      const byType = PUNCH_TYPES.reduce((acc, type) => {
        acc[type] = userPunches.find((punch) => punch.type === type) || null;
        return acc;
      }, {});

      return {
        user: user.toJSON(),
        punches: userPunches,
        byType,
        completed: Boolean(
          byType.entrada &&
            byType.intervalo &&
            byType.retorno &&
            byType.saida
        ),
      };
    });

    res.json({
      success: true,
      date: startOfDay.toISOString().slice(0, 10),
      summary: {
        employees: employees.length,
        withEntrada: employees.filter((item) => item.byType.entrada).length,
        completed: employees.filter((item) => item.completed).length,
      },
      employees,
    });
  } catch (error) {
    logger.error('Erro ao buscar dashboard admin', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dashboard do RH',
      error: error.message,
    });
  }
};
