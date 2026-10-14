const express = require('express');
const { protect } = require('../middleware/auth');
const { getPrediction, getRisk, runBacktest, getAISummary } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/stocks/:symbol/prediction', protect, getPrediction);
router.get('/stocks/:symbol/risk', protect, getRisk);
router.get('/stocks/:symbol/ai-summary', protect, getAISummary);
router.post('/backtest', protect, runBacktest);

module.exports = router;