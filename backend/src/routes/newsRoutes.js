const express = require('express');
const { getStockNews, getMarketNews } = require('../controllers/newsController');

const router = express.Router();

router.get('/market/general', getMarketNews);
router.get('/:symbol', getStockNews);

module.exports = router;
