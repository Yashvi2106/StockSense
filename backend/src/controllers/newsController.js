const newsService = require('../services/newsService');

// @desc    Get news articles and sentiment for a stock
// @route   GET /api/news/:symbol
// @access  Public
const getStockNews = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ success: false, message: 'Stock symbol is required' });
    }

    const data = await newsService.getStockNews(symbol);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get general market news
// @route   GET /api/news/market/general
// @access  Public
const getMarketNews = async (req, res, next) => {
  try {
    const data = await newsService.getMarketNews();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStockNews,
  getMarketNews
};
