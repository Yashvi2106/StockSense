import api from './api';

export const stockService = {
  async searchStocks(query) {
    if (!query || !query.trim()) return [];
    const res = await api.get(`/stocks/search?q=${encodeURIComponent(query)}`);
    return res.data.data || [];
  },

  async getQuote(symbol) {
    const res = await api.get(`/stocks/${encodeURIComponent(symbol)}/quote`);
    return res.data.data;
  },

  async getHistory(symbol, range = '1M') {
    const res = await api.get(`/stocks/${encodeURIComponent(symbol)}/history?range=${range}`);
    return res.data.data || [];
  },

  async getMarketOverview() {
    const res = await api.get('/stocks/market/overview');
    return res.data.data;
  },

  async getCuratedStocks() {
    const res = await api.get('/stocks/curated/list');
    return res.data.data || [];
  },

  async getCharts(symbol, range = '1M') {
    const res = await api.get(`/stocks/${encodeURIComponent(symbol)}/charts?range=${range}`);
    return res.data;
  },

  async getTechnical(symbol, range = '6M') {
    const res = await api.get(`/stocks/${encodeURIComponent(symbol)}/technical?range=${range}`);
    return res.data;
  }
};
