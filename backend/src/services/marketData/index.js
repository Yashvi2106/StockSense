const YahooFinanceProvider = require('./yahooFinanceProvider');
const mongoose = require('mongoose');
const { Stock, HistoricalPrice } = require('../../models');
const { normalizeSymbol } = require('./symbolResolver');

class MarketDataService {
  constructor() {
    this.primaryProvider = new YahooFinanceProvider();
    this.quoteCache = new Map(); // In-memory cache for fast sub-minute quotes
    this.QUOTE_CACHE_TTL = 30 * 1000; // 30 seconds
    this.quoteRequests = new Map();
    this.historyRequests = new Map();
    this.providerCooldownUntil = 0;
  }

  async searchStocks(query) {
    if (!query || !query.trim()) return [];
    try {
      return await this.primaryProvider.searchStocks(query);
    } catch (err) {
      console.warn(`[MarketData] Search failed (${err.message}). Returning catalog matches only.`);
      return [];
    }
  }

  async getQuote(symbol) {
    const norm = normalizeSymbol(symbol);
    if (Date.now() < this.providerCooldownUntil) {
      throw Object.assign(new Error('Market-data provider rate limit reached. Please retry later.'), { statusCode: 429, code: 'PROVIDER_RATE_LIMIT' });
    }
    const cached = this.quoteCache.get(norm);
    if (cached && Date.now() - cached.timestamp < this.QUOTE_CACHE_TTL) {
      return cached.data;
    }

    if (this.quoteRequests.has(norm)) return this.quoteRequests.get(norm);

    const request = (async () => {
      try {
      const quote = await this.primaryProvider.getQuote(norm);
      this.quoteCache.set(norm, { timestamp: Date.now(), data: quote });
      if (mongoose.connection.readyState === 1) {
        Stock.findOneAndUpdate(
          { symbol: norm },
          { ...quote, quoteTimestamp: quote.timestamp, lastUpdated: quote.fetchedAt },
          { upsert: true }
        ).catch((err) => console.error('[MarketData] Error caching stock quote:', err.message));
      }
      return quote;
      } catch (err) {
        if (/too many requests|rate limit/i.test(err.message || '')) this.providerCooldownUntil = Date.now() + 30 * 1000;
        console.warn(`[MarketData] Quote unavailable for ${norm}: ${err.message}`);
        throw err;
      } finally {
        this.quoteRequests.delete(norm);
      }
    })();
    this.quoteRequests.set(norm, request);
    return request;
  }

  async getHistorical(symbol, range = '1M') {
    const norm = normalizeSymbol(symbol);
    const requestKey = `${norm}:${range.toUpperCase()}`;
    if (this.historyRequests.has(requestKey)) return this.historyRequests.get(requestKey);

    const request = (async () => {
      try {
        const candles = await this.primaryProvider.getHistorical(norm, range);
        if (candles.length === 0) throw Object.assign(new Error(`No historical data found for ${norm}`), { statusCode: 404, code: 'HISTORICAL_NOT_FOUND' });
        this.cacheHistorical(norm, candles, range);
        return candles;
      } catch (err) {
        const cachedCandles = await this.readHistoricalCache(norm, range);
        if (cachedCandles.length > 0) {
          console.warn(`[MarketData] Provider history unavailable for ${norm}; returning ${cachedCandles.length} cached historical candles.`);
          return cachedCandles;
        }
        const noHistory = err.code === 'HISTORICAL_NOT_FOUND' || /no historical data/i.test(err.message || '');
        const rateLimited = /too many requests|rate limit/i.test(err.message || '');
        if (rateLimited) this.providerCooldownUntil = Date.now() + 30 * 1000;
        const normalizedError = noHistory
          ? Object.assign(new Error(`No historical data found for ${norm}`), { statusCode: 404, code: 'HISTORICAL_NOT_FOUND' })
          : err;
        console.warn(`[MarketData] Historical data unavailable for ${norm}: ${normalizedError.message}`);
        throw normalizedError;
      } finally {
        this.historyRequests.delete(requestKey);
      }
    })();
    this.historyRequests.set(requestKey, request);
    return request;
  }

  async readHistoricalCache(norm, range) {
    if (mongoose.connection.readyState !== 1) return [];
    const rangeDays = { '1D': 2, '1W': 10, '1M': 40, '3M': 100, '6M': 190, '1Y': 380, '5Y': 1900 }[range.toUpperCase()] || 40;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - rangeDays);
    return HistoricalPrice.find({ symbol: norm, date: { $gte: startDate }, dataStatus: 'HISTORICAL' })
      .sort({ date: 1 }).lean();
  }

  cacheHistorical(norm, candles, range) {
    if (mongoose.connection.readyState === 1 && candles && candles.length > 0 && range !== '1D') {
      const bulkOps = candles.slice(-50).map((c) => ({
        updateOne: {
          filter: { symbol: norm, date: new Date(c.date) },
          update: {
            $set: {
              symbol: norm,
              date: new Date(c.date),
              open: c.open,
              high: c.high,
              low: c.low,
              close: c.close,
              volume: c.volume,
              marketTimestamp: new Date(c.date),
              fetchedAt: new Date(),
              source: 'Yahoo Finance',
              dataStatus: 'HISTORICAL'
            }
          },
          upsert: true
        }
      }));

      HistoricalPrice.bulkWrite(bulkOps).catch((e) =>
        console.error('[MarketData] Error caching historical candles:', e.message)
      );
    }
  }

  async getMarketOverview() {
    try {
      return await this.primaryProvider.getMarketOverview();
    } catch (err) {
      console.warn(`[MarketData] Market overview unavailable (${err.message}).`);
      throw err;
    }
  }
}

const marketDataService = new MarketDataService();
module.exports = marketDataService;
