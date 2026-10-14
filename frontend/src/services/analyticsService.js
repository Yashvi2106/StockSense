import api from './api';

export const analyticsService = {
  async getPrediction(symbol) { return (await api.get(`/stocks/${encodeURIComponent(symbol)}/prediction`)).data.data; },
  async getRisk(symbol) { return (await api.get(`/stocks/${encodeURIComponent(symbol)}/risk`)).data.data; },
  async getAISummary(symbol) { return (await api.get(`/stocks/${encodeURIComponent(symbol)}/ai-summary`)).data.data; },
  async runBacktest(payload) { return (await api.post('/backtest', payload)).data.data; }
};