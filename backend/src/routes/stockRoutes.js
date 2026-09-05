const express = require('express');
const {
  searchStocks,
  getStockQuote,
  getHistoricalData,
  getMarketOverview,
  getCuratedStocks,
  getStockTechnical,
  getStockChartData
} = require('../controllers/stockController');

const router = express.Router();

router.get('/search', searchStocks);
router.get('/market/overview', getMarketOverview);
router.get('/curated/list', getCuratedStocks);
router.get('/:symbol', getStockQuote);
router.get('/:symbol/history', getHistoricalData);
router.get('/:symbol/technical', getStockTechnical);
router.get('/:symbol/charts', getStockChartData);

module.exports = router;
