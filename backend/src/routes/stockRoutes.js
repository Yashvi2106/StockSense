const express = require('express');
const {
  searchStocks,
  getStockQuote,
  getHistoricalData,
  getMarketOverview,
  getCuratedStocks
} = require('../controllers/stockController');

const router = express.Router();

router.get('/search', searchStocks);
router.get('/market/overview', getMarketOverview);
router.get('/curated/list', getCuratedStocks);
router.get('/:symbol', getStockQuote);
router.get('/:symbol/history', getHistoricalData);

module.exports = router;
