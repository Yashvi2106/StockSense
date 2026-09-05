const axios = require('axios');
const config = require('../config/env');

const mlApi = axios.create({
  baseURL: config.mlServiceUrl,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

const mlClient = {
  /**
   * Calls FastAPI POST /nlp/sentiment
   */
  async analyzeSentiment(title, description = '') {
    try {
      const res = await mlApi.post('/nlp/sentiment', { title, description });
      return res.data;
    } catch (err) {
      console.warn(`[MLClient] FastAPI sentiment request failed (${err.message}). Using local rule engine.`);
      return this.localSentimentFallback(title, description);
    }
  },

  /**
   * Local JavaScript fallback sentiment analyzer for local dev offline resilience
   */
  localSentimentFallback(title, description = '') {
    const text = `${title} ${description}`.toLowerCase();
    const posWords = ['surge', 'grow', 'growth', 'gain', 'profit', 'beat', 'bullish', 'high', 'strong', 'win', 'deal', 'soar', 'record'];
    const negWords = ['plunge', 'drop', 'fall', 'loss', 'miss', 'decline', 'bearish', 'warning', 'lawsuit', 'recession', 'inflation', 'crash'];

    let pos = 0;
    let neg = 0;

    posWords.forEach((w) => { if (text.includes(w)) pos++; });
    negWords.forEach((w) => { if (text.includes(w)) neg++; });

    if (pos === 0 && neg === 0) {
      return { sentiment: 'neutral', score: 0.0, confidence: 0.65 };
    }

    const score = Number(((pos - neg) / (pos + neg)).toFixed(2));
    const sentiment = score > 0.15 ? 'positive' : score < -0.15 ? 'negative' : 'neutral';
    return {
      sentiment,
      score,
      confidence: 0.80
    };
  }
};

module.exports = mlClient;
