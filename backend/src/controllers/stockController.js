const marketDataService = require('../services/marketData');
const { DEFAULT_STOCKS } = require('../utils/stockCatalog');

// @desc    Search stocks by ticker or company name
// @route   GET /api/stocks/search
// @access  Public
const searchStocks = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const results = await marketDataService.searchStocks(q);
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current quote and details for a stock
// @route   GET /api/stocks/:symbol
// @access  Public
const getStockQuote = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ success: false, message: 'Stock symbol is required' });
    }

    const quote = await marketDataService.getQuote(symbol);
    res.status(200).json({
      success: true,
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get historical OHLCV data for a stock
// @route   GET /api/stocks/:symbol/history
// @access  Public
const getHistoricalData = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { range = '1M' } = req.query;

    if (!symbol) {
      return res.status(400).json({ success: false, message: 'Stock symbol is required' });
    }

    const validRanges = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];
    const selectedRange = validRanges.includes(range.toUpperCase()) ? range.toUpperCase() : '1M';

    const history = await marketDataService.getHistorical(symbol, selectedRange);
    res.status(200).json({
      success: true,
      symbol: symbol.toUpperCase(),
      range: selectedRange,
      count: history.length,
      dataStatus: 'HISTORICAL',
      dataSource: 'Yahoo Finance',
      timezone: 'Asia/Kolkata',
      data: history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get market overview benchmarks and top movers
// @route   GET /api/stocks/market/overview
// @access  Public
const getMarketOverview = async (req, res, next) => {
  try {
    const indices = await marketDataService.getMarketOverview();

    // Get quotes for top 4 featured stocks to show movers
    const featuredSymbols = ['TCS', 'RELIANCE', 'INFY', 'HDFCBANK'];
    const moversPromises = featuredSymbols.map((sym) =>
      marketDataService.getQuote(sym).catch(() => null)
    );
    const movers = (await Promise.all(moversPromises)).filter(Boolean);

    res.status(200).json({
      success: true,
      data: {
        indices,
        movers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get technical indicators and score for a stock
// @route   GET /api/stocks/:symbol/technical
// @access  Public
const getStockTechnical = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { range = '6M' } = req.query;

    const history = await marketDataService.getHistorical(symbol, range);
    const technicalService = require('../services/technicalService');
    const { latest, scoring } = technicalService.computeIndicators(history);

    res.status(200).json({
      success: true,
      symbol: symbol.toUpperCase(),
      indicators: latest,
      scoring
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enriched historical data with indicator overlays
// @route   GET /api/stocks/:symbol/charts
// @access  Public
const getStockChartData = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { range = '1M' } = req.query;

    const history = await marketDataService.getHistorical(symbol, range);
    const technicalService = require('../services/technicalService');
    const { candles, scoring } = technicalService.computeIndicators(history);

    res.status(200).json({
      success: true,
      symbol: symbol.toUpperCase(),
      range,
      count: candles.length,
      scoring,
      candles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get curated list of supported featured stocks
// @route   GET /api/stocks/curated/list
// @access  Public
const getCuratedStocks = (req, res) => {
  res.status(200).json({
    success: true,
    count: DEFAULT_STOCKS.length,
    data: DEFAULT_STOCKS
  });
};

module.exports = {
  searchStocks,
  getStockQuote,
  getHistoricalData,
  getMarketOverview,
  getCuratedStocks,
  getStockTechnical,
  getStockChartData
};
