/**
 * Abstract interface for market data providers
 */
class MarketDataProvider {
  async searchStocks(query) {
    throw new Error('searchStocks() must be implemented');
  }

  async getQuote(symbol) {
    throw new Error('getQuote() must be implemented');
  }

  async getHistorical(symbol, range, interval) {
    throw new Error('getHistorical() must be implemented');
  }

  async getMarketOverview() {
    throw new Error('getMarketOverview() must be implemented');
  }
}

module.exports = MarketDataProvider;
