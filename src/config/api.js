export const USE_API =
  process.env.EXPO_PUBLIC_USE_API === 'true' &&
  Boolean(process.env.EXPO_PUBLIC_API_URL);

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
