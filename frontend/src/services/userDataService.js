import api from './api';

export const userDataService = {
  async getWatchlist() { return (await api.get('/watchlist')).data.data || []; },
  async addWatchlist(payload) { return (await api.post('/watchlist', payload)).data.data; },
  async removeWatchlist(symbol) { return api.delete(`/watchlist/${encodeURIComponent(symbol)}`); },
  async getPortfolio() { return (await api.get('/portfolio')).data.data; },
  async addHolding(payload) { return (await api.post('/portfolio/holdings', payload)).data.data; },
  async removeHolding(id) { return api.delete(`/portfolio/holdings/${id}`); },
  async getAlerts() { return (await api.get('/alerts')).data.data || []; },
  async addAlert(payload) { return (await api.post('/alerts', payload)).data.data; },
  async removeAlert(id) { return api.delete(`/alerts/${id}`); }
};