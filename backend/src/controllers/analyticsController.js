const marketDataService = require('../services/marketData');
const technicalService = require('../services/technicalService');
const mlClient = require('../services/mlClient');
const aiSummaryService = require('../services/aiSummaryService');

const getPrediction = async (req, res, next) => {
  try {
    const quote = await marketDataService.getQuote(req.params.symbol);
    const history = await marketDataService.getHistorical(req.params.symbol, '1Y');
    res.json({ success: true, data: await mlClient.predict(req.params.symbol, quote.currentPrice, history) });
  } catch (error) { next(error); }
};

const getAISummary = async (req, res, next) => {
  try {
    const summary = await aiSummaryService.generateStockSummary(req.params.symbol);
    res.json({ success: true, data: summary });
  } catch (error) { next(error); }
};

const getRisk = async (req, res, next) => {
  try {
    const history = await marketDataService.getHistorical(req.params.symbol, '1Y');
    const returns = history.slice(1).map((item, index) => (item.close - history[index].close) / history[index].close).filter(Number.isFinite);
    const mean = returns.reduce((sum, value) => sum + value, 0) / (returns.length || 1);
    const variance = returns.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / (returns.length || 1);
    const volatility = Math.sqrt(variance) * Math.sqrt(252);
    const sorted = [...returns].sort((a, b) => a - b);
    let peak = 1; let equity = 1; let maxDrawdown = 0;
    returns.forEach((value) => { equity *= 1 + value; peak = Math.max(peak, equity); maxDrawdown = Math.min(maxDrawdown, equity / peak - 1); });
    res.json({ success: true, data: { symbol: req.params.symbol.toUpperCase(), volatility: Number(volatility.toFixed(4)), var95: Number((sorted[Math.max(0, Math.floor(sorted.length * 0.05))] || 0).toFixed(4)), maxDrawdown: Number(maxDrawdown.toFixed(4)), sharpeRatio: Number(((mean * 252) / (volatility || 1)).toFixed(2)), observations: returns.length } });
  } catch (error) { next(error); }
};

const runBacktest = async (req, res, next) => {
  try {
    const { symbol, strategy = 'sma_crossover', initialCapital = 100000, range = '1Y' } = req.body;
    if (!symbol || Number(initialCapital) <= 0) return res.status(400).json({ success: false, message: 'Symbol and positive initial capital are required.' });
    const history = await marketDataService.getHistorical(symbol, range);
    const { candles } = technicalService.computeIndicators(history);
    let cash = Number(initialCapital); let shares = 0; let trades = 0;
    candles.forEach((candle) => {
      const buy = strategy === 'buy_and_hold' ? trades === 0 : strategy === 'rsi_strategy' ? candle.rsi < 30 : candle.sma20 > candle.sma50;
      const sell = strategy !== 'buy_and_hold' && (strategy === 'rsi_strategy' ? candle.rsi > 70 : candle.sma20 < candle.sma50);
      if (buy && !shares && candle.close > 0) { shares = cash / candle.close; cash = 0; trades++; }
      if (sell && shares) { cash = shares * candle.close; shares = 0; trades++; }
    });
    const finalPrice = candles[candles.length - 1]?.close || Number(initialCapital);
    const finalCapital = cash + shares * finalPrice;
    res.json({ success: true, data: { symbol: symbol.toUpperCase(), strategy, initialCapital: Number(initialCapital), finalCapital: Number(finalCapital.toFixed(2)), returnPercent: Number((((finalCapital / initialCapital) - 1) * 100).toFixed(2)), trades, candles } });
  } catch (error) { next(error); }
};

module.exports = { getPrediction, getRisk, runBacktest, getAISummary };