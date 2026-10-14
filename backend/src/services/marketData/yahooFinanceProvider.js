const yahooFinance = require('yahoo-finance2').default;
const MarketDataProvider = require('./providerInterface');
const { DEFAULT_STOCKS } = require('../../utils/stockCatalog');
const { normalizeSymbol, resolveSymbol } = require('./symbolResolver');
const { TIMEZONE, getMarketStatus, getDataStatus } = require('./marketStatus');

class YahooFinanceProvider extends MarketDataProvider {
  constructor() {
    super();
    // Suppress survey and deprecation notices in yahoo-finance2
    if (yahooFinance.suppressNotices) {
      yahooFinance.suppressNotices(['yahooSurvey', 'ripHistorical']);
    }
  }

  async searchStocks(query) {
    const q = query.trim().toLowerCase();
    // 1. Search local curated catalog
    const localMatches = DEFAULT_STOCKS.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.companyName.toLowerCase().includes(q)
    );

    // 2. Query Yahoo Finance autocomplete if online
    try {
      const searchRes = await yahooFinance.search(query, { newsCount: 0, quotesCount: 6 });
      if (searchRes && searchRes.quotes) {
        const yahooQuotes = searchRes.quotes
          .filter((q) => q.isYahooFinance && q.symbol)
          .map((q) => ({
            symbol: normalizeSymbol(q.symbol),
            rawSymbol: q.symbol,
            companyName: q.shortname || q.longname || q.symbol,
            exchange: q.exchange || 'NSE',
            sector: 'General',
            industry: 'General'
          }));

        // Merge with local matches avoiding duplicate symbols
        const seen = new Set(localMatches.map((m) => m.symbol));
        for (const item of yahooQuotes) {
          if (!seen.has(item.symbol)) {
            seen.add(item.symbol);
            localMatches.push(item);
          }
        }
      }
    } catch (err) {
      // Local matches serve as instant fallback
    }

    return localMatches.slice(0, 10);
  }

  async getQuote(symbol) {
    const resolved = resolveSymbol(symbol);
    const yahooSym = resolved.providerSymbol;
    const norm = resolved.symbol;
    const catalogItem = DEFAULT_STOCKS.find((s) => s.symbol === norm);

    const quote = await yahooFinance.quote(yahooSym);
    if (!quote || !quote.regularMarketPrice) throw Object.assign(new Error(`Stock quote not found for ${symbol}`), { statusCode: 404, code: 'STOCK_NOT_FOUND' });

    const currentPrice = quote.regularMarketPrice || quote.ask || quote.bid || quote.previousClose || 0;
    const previousClose = quote.regularMarketPreviousClose || currentPrice;
    const change = quote.regularMarketChange ?? (currentPrice - previousClose);
    const changePercent = quote.regularMarketChangePercent ?? (previousClose ? ((currentPrice - previousClose) / previousClose) * 100 : 0);

    const providerTimestamp = quote.regularMarketTime
      ? (quote.regularMarketTime instanceof Date ? quote.regularMarketTime : new Date(Number(quote.regularMarketTime) * 1000))
      : null;
    const marketStatus = getMarketStatus(new Date(), resolved.exchange, quote.marketState);
    return {
      symbol: norm,
      price: Number(currentPrice.toFixed(2)),
      yahooSymbol: yahooSym,
      companyName: quote.longName || quote.shortName || catalogItem?.companyName || norm,
      exchange: quote.exchange || resolved.exchange || catalogItem?.exchange || 'NSE',
      currency: quote.currency || (norm.endsWith('.NS') ? 'INR' : 'INR'),
      currentPrice: Number(currentPrice.toFixed(2)),
      previousClose: Number(previousClose.toFixed(2)),
      open: Number((quote.regularMarketOpen || currentPrice).toFixed(2)),
      high: Number((quote.regularMarketDayHigh || currentPrice).toFixed(2)),
      low: Number((quote.regularMarketDayLow || currentPrice).toFixed(2)),
      volume: quote.regularMarketVolume || 0,
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      marketCap: quote.marketCap || 0,
      peRatio: quote.trailingPE ? Number(quote.trailingPE.toFixed(2)) : null,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh ? Number(quote.fiftyTwoWeekHigh.toFixed(2)) : null,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow ? Number(quote.fiftyTwoWeekLow.toFixed(2)) : null,
      sector: catalogItem?.sector || 'General',
      industry: catalogItem?.industry || 'General',
      timestamp: providerTimestamp,
      lastUpdated: providerTimestamp || new Date(),
      fetchedAt: new Date(),
      timezone: TIMEZONE,
      marketStatus,
      dataStatus: getDataStatus({ marketStatus, providerTimestamp, delayedBy: quote.exchangeDataDelayedBy || 0 }),
      dataSource: 'Yahoo Finance'
    };
  }

  async getHistorical(symbol, range = '1M') {
    const resolved = resolveSymbol(symbol);
    const yahooSym = resolved.providerSymbol;
    const norm = resolved.symbol;

    // Map range to period1 start date
    const now = new Date();
    const period1 = new Date();
    let interval = '1d';

    switch (range.toUpperCase()) {
      case '1D':
        period1.setDate(now.getDate() - 2);
        interval = '15m';
        break;
      case '1W':
        period1.setDate(now.getDate() - 7);
        interval = '1d';
        break;
      case '1M':
        period1.setMonth(now.getMonth() - 1);
        interval = '1d';
        break;
      case '3M':
        period1.setMonth(now.getMonth() - 3);
        interval = '1d';
        break;
      case '6M':
        period1.setMonth(now.getMonth() - 6);
        interval = '1d';
        break;
      case '1Y':
        period1.setFullYear(now.getFullYear() - 1);
        interval = '1d';
        break;
      case '5Y':
        period1.setFullYear(now.getFullYear() - 5);
        interval = '1wk';
        break;
      default:
        period1.setMonth(now.getMonth() - 1);
        interval = '1d';
    }

    const queryOptions = {
      period1,
      period2: now,
      interval
    };

    let quotes = [];
    try {
      const chartResult = await yahooFinance.chart(yahooSym, queryOptions);
      quotes = chartResult?.quotes || [];
    } catch (chartError) {
      try {
        quotes = await yahooFinance.historical(yahooSym, queryOptions);
      } catch (historicalError) {
        throw historicalError || chartError;
      }
    }

    if (!quotes || quotes.length === 0) {
      throw Object.assign(new Error(`No historical data found for ${symbol}`), { statusCode: 404, code: 'HISTORICAL_NOT_FOUND' });
    }

    return quotes
      .filter((candle) => candle.close != null && candle.date != null)
      .map((candle) => ({
        symbol: norm,
        date: new Date(candle.date).toISOString().split('T')[0],
        open: Number((candle.open ?? candle.close).toFixed(2)),
        high: Number((candle.high ?? candle.close).toFixed(2)),
        low: Number((candle.low ?? candle.close).toFixed(2)),
        close: Number(candle.close.toFixed(2)),
        volume: candle.volume || 0
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  async getMarketOverview() {
    const indices = [
      { name: 'NIFTY 50', symbol: '^NSEI', region: 'India' },
      { name: 'SENSEX', symbol: '^BSESN', region: 'India' },
      { name: 'S&P 500', symbol: '^GSPC', region: 'US' },
      { name: 'NASDAQ', symbol: '^IXIC', region: 'US' }
    ];

    const results = [];
    for (const idx of indices) {
      try {
        const q = await yahooFinance.quote(idx.symbol);
        const price = q.regularMarketPrice || q.previousClose || 0;
        const change = q.regularMarketChange || 0;
        const changePercent = q.regularMarketChangePercent || 0;
        results.push({
          name: idx.name,
          symbol: idx.symbol,
          region: idx.region,
          price: Number(price.toFixed(2)),
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2))
        });
      } catch (err) {
        console.warn(`[MarketData] Index unavailable for ${idx.symbol}: ${err.message}`);
      }
    }
    if (results.length === 0) throw Object.assign(new Error('Market overview unavailable'), { statusCode: 503, code: 'DATA_UNAVAILABLE' });
    return results;
  }
}

module.exports = YahooFinanceProvider;
