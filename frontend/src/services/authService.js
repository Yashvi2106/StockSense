import api from './api';

export const authService = {
  async register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updatePreferences(preferences) {
    const res = await api.put('/auth/preferences', preferences);
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
  }
};
