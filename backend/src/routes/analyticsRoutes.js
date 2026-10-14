const express = require('express');
const { optionalProtect } = require('../middleware/auth');
const { getPrediction, getRisk, runBacktest, getAISummary } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/stocks/:symbol/prediction', optionalProtect, getPrediction);
router.get('/stocks/:symbol/risk', optionalProtect, getRisk);
router.get('/stocks/:symbol/ai-summary', optionalProtect, getAISummary);
router.post('/backtest', optionalProtect, runBacktest);

module.exports = router;