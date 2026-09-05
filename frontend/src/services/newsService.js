import api from './api';

export const newsService = {
  async getStockNews(symbol) {
    const res = await api.get(`/news/${encodeURIComponent(symbol)}`);
    return res.data.data;
  },

  async getMarketNews() {
    const res = await api.get('/news/market/general');
    return res.data.data;
  }
};
