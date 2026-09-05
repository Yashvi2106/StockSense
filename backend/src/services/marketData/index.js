const YahooFinanceProvider = require('./yahooFinanceProvider');
const FallbackMarketDataProvider = require('./fallbackProvider');
const { Stock, HistoricalPrice } = require('../../models');
const { getNormalizedSymbol } = require('../../utils/stockCatalog');

class MarketDataService {
  constructor() {
    this.primaryProvider = new YahooFinanceProvider();
    this.fallbackProvider = new FallbackMarketDataProvider();
    this.quoteCache = new Map(); // In-memory cache for fast sub-minute quotes
    this.QUOTE_CACHE_TTL = 30 * 1000; // 30 seconds
  }

  async searchStocks(query) {
    if (!query || !query.trim()) return [];
    try {
      return await this.primaryProvider.searchStocks(query);
    } catch (err) {
      console.warn(`[MarketData] Primary search failed (${err.message}). Using fallback search.`);
      return await this.fallbackProvider.searchStocks(query);
    }
  }

  async getQuote(symbol) {
    const norm = getNormalizedSymbol(symbol);
    const cached = this.quoteCache.get(norm);
    if (cached && Date.now() - cached.timestamp < this.QUOTE_CACHE_TTL) {
      return cached.data;
    }

    let quote;
    try {
      quote = await this.primaryProvider.getQuote(norm);
    } catch (err) {
      console.warn(`[MarketData] Live quote failed for ${norm} (${err.message}). Using fallback.`);
      quote = await this.fallbackProvider.getQuote(norm);
    }

    // Update in-memory quote cache
    this.quoteCache.set(norm, { timestamp: Date.now(), data: quote });

    // Asynchronously upsert to MongoDB Stock metadata cache
    Stock.findOneAndUpdate(
      { symbol: norm },
      {
        symbol: norm,
        companyName: quote.companyName,
        exchange: quote.exchange,
        sector: quote.sector,
        industry: quote.industry,
        lastUpdated: new Date()
      },
      { upsert: true }
    ).catch((err) => console.error('[MarketData] Error caching stock to MongoDB:', err.message));

    return quote;
  }

  async getHistorical(symbol, range = '1M') {
    const norm = getNormalizedSymbol(symbol);
    let candles = [];

    try {
      candles = await this.primaryProvider.getHistorical(norm, range);
    } catch (err) {
      console.warn(`[MarketData] Historical fetch failed for ${norm} (${err.message}). Using fallback.`);
      candles = await this.fallbackProvider.getHistorical(norm, range);
    }

    // Asynchronously cache historical daily candles to MongoDB HistoricalPrice
    if (candles && candles.length > 0 && range !== '1D') {
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
              volume: c.volume
            }
          },
          upsert: true
        }
      }));

      HistoricalPrice.bulkWrite(bulkOps).catch((e) =>
        console.error('[MarketData] Error caching historical candles:', e.message)
      );
    }

    return candles;
  }

  async getMarketOverview() {
    try {
      return await this.primaryProvider.getMarketOverview();
    } catch (err) {
      console.warn(`[MarketData] Market overview primary failed (${err.message}). Using fallback.`);
      return await this.fallbackProvider.getMarketOverview();
    }
  }
}

const marketDataService = new MarketDataService();
module.exports = marketDataService;
