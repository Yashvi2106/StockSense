const MarketDataProvider = require('./providerInterface');
const { DEFAULT_STOCKS, getNormalizedSymbol } = require('../../utils/stockCatalog');

const BASELINE_PRICES = {
  TCS: { price: 3421.5, sector: 'Technology', industry: 'IT Services', currency: 'INR' },
  INFY: { price: 1845.2, sector: 'Technology', industry: 'IT Services', currency: 'INR' },
  RELIANCE: { price: 2980.75, sector: 'Energy', industry: 'Oil & Gas Refining', currency: 'INR' },
  HDFCBANK: { price: 1640.3, sector: 'Financial Services', industry: 'Private Bank', currency: 'INR' },
  ICICIBANK: { price: 1210.8, sector: 'Financial Services', industry: 'Private Bank', currency: 'INR' },
  TATAMOTORS: { price: 980.4, sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', currency: 'INR' },
  SBIN: { price: 815.6, sector: 'Financial Services', industry: 'Public Bank', currency: 'INR' },
  BHARTIARTL: { price: 1540.0, sector: 'Telecom', industry: 'Telecom Services', currency: 'INR' },
  ITC: { price: 505.2, sector: 'Consumer Defensive', industry: 'FMCG', currency: 'INR' },
  WIPRO: { price: 540.6, sector: 'Technology', industry: 'IT Services', currency: 'INR' },
  AAPL: { price: 228.4, sector: 'Technology', industry: 'Consumer Electronics', currency: 'USD' },
  MSFT: { price: 425.8, sector: 'Technology', industry: 'Software', currency: 'USD' },
  NVDA: { price: 122.5, sector: 'Technology', industry: 'Semiconductors', currency: 'USD' },
  GOOGL: { price: 165.2, sector: 'Communication Services', industry: 'Internet Content', currency: 'USD' },
  AMZN: { price: 188.9, sector: 'Consumer Cyclical', industry: 'Internet Retail', currency: 'USD' },
  TSLA: { price: 215.3, sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', currency: 'USD' }
};

class FallbackMarketDataProvider extends MarketDataProvider {
  async searchStocks(query) {
    const q = query.trim().toLowerCase();
    return DEFAULT_STOCKS.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.companyName.toLowerCase().includes(q)
    ).map((s) => ({ ...s, isFallback: true }));
  }

  async getQuote(symbol) {
    const norm = getNormalizedSymbol(symbol);
    const item = BASELINE_PRICES[norm] || { price: 1000.0, sector: 'General', industry: 'General', currency: 'INR' };
    const catalogItem = DEFAULT_STOCKS.find((s) => s.symbol === norm);

    const price = item.price;
    const change = Number(((Math.sin(Date.now() / 100000) * 0.02) * price).toFixed(2));
    const previousClose = Number((price - change).toFixed(2));
    const changePercent = Number(((change / previousClose) * 100).toFixed(2));

    return {
      symbol: norm,
      companyName: catalogItem?.companyName || `${norm} Corporation`,
      exchange: catalogItem?.exchange || 'NSE',
      currency: item.currency,
      currentPrice: price,
      previousClose,
      open: Number((price * 0.995).toFixed(2)),
      high: Number((price * 1.015).toFixed(2)),
      low: Number((price * 0.99).toFixed(2)),
      volume: Math.floor(1000000 + Math.random() * 500000),
      change,
      changePercent,
      marketCap: Math.floor(price * 100000000),
      peRatio: 26.4,
      fiftyTwoWeekHigh: Number((price * 1.25).toFixed(2)),
      fiftyTwoWeekLow: Number((price * 0.82).toFixed(2)),
      sector: item.sector,
      industry: item.industry,
      lastUpdated: new Date(),
      isFallback: true
    };
  }

  async getHistorical(symbol, range = '1M') {
    const norm = getNormalizedSymbol(symbol);
    const base = BASELINE_PRICES[norm]?.price || 1000;
    
    let days = 30;
    if (range === '1D') days = 1;
    else if (range === '1W') days = 7;
    else if (range === '1M') days = 30;
    else if (range === '3M') days = 90;
    else if (range === '6M') days = 180;
    else if (range === '1Y') days = 365;
    else if (range === '5Y') days = 1825;

    const points = [];
    let current = base * (range === '5Y' ? 0.45 : range === '1Y' ? 0.8 : 0.95);
    const now = new Date();

    for (let i = days; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      // Skip weekends
      if (d.getDay() === 0 || d.getDay() === 6) continue;

      const randomShock = (Math.sin(i * 0.3) * 0.015) + ((Math.cos(i * 0.7) * 0.01));
      const open = current;
      const close = current * (1 + randomShock);
      const high = Math.max(open, close) * (1 + Math.abs(randomShock) * 0.5);
      const low = Math.min(open, close) * (1 - Math.abs(randomShock) * 0.5);
      const volume = Math.floor(800000 + Math.abs(Math.sin(i)) * 600000);

      points.push({
        symbol: norm,
        date: d.toISOString().split('T')[0],
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
        isFallback: true
      });

      current = close;
    }

    return points;
  }

  async getMarketOverview() {
    return [
      { name: 'NIFTY 50', symbol: '^NSEI', region: 'India', price: 24540.2, change: 112.4, changePercent: 0.46, isFallback: true },
      { name: 'SENSEX', symbol: '^BSESN', region: 'India', price: 80620.5, change: 345.1, changePercent: 0.43, isFallback: true },
      { name: 'S&P 500', symbol: '^GSPC', region: 'US', price: 5612.3, change: -18.2, changePercent: -0.32, isFallback: true },
      { name: 'NASDAQ', symbol: '^IXIC', region: 'US', price: 17820.8, change: -45.6, changePercent: -0.26, isFallback: true }
    ];
  }
}

module.exports = FallbackMarketDataProvider;
