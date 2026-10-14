const { Watchlist, Portfolio, Holding, Alert } = require('../models');
const marketDataService = require('../services/marketData');

const getPortfolio = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user._id }).sort({ createdAt: 1 });
    if (!portfolio) portfolio = await Portfolio.create({ userId: req.user._id, name: 'Primary Portfolio' });
    const holdings = await Holding.find({ portfolioId: portfolio._id }).lean();
    const enriched = await Promise.all(holdings.map(async (holding) => {
      const quote = await marketDataService.getQuote(holding.symbol).catch(() => null);
      const currentPrice = quote?.currentPrice ?? holding.averageBuyPrice;
      const investedValue = holding.quantity * holding.averageBuyPrice;
      const currentValue = holding.quantity * currentPrice;
      return { ...holding, currentPrice, investedValue, currentValue, pnl: currentValue - investedValue, pnlPercent: investedValue ? ((currentValue - investedValue) / investedValue) * 100 : 0 };
    }));
    const totals = enriched.reduce((result, holding) => ({ investedValue: result.investedValue + holding.investedValue, currentValue: result.currentValue + holding.currentValue }), { investedValue: 0, currentValue: 0 });
    res.json({ success: true, data: { portfolio, holdings: enriched, totals: { ...totals, pnl: totals.currentValue - totals.investedValue, pnlPercent: totals.investedValue ? ((totals.currentValue - totals.investedValue) / totals.investedValue) * 100 : 0 } } });
  } catch (error) { next(error); }
};

const addHolding = async (req, res, next) => {
  try {
    const { symbol, quantity, averageBuyPrice } = req.body;
    if (!symbol || Number(quantity) <= 0 || Number(averageBuyPrice) <= 0) return res.status(400).json({ success: false, message: 'Symbol, quantity, and average buy price are required.' });
    let portfolio = await Portfolio.findOne({ userId: req.user._id }).sort({ createdAt: 1 });
    if (!portfolio) portfolio = await Portfolio.create({ userId: req.user._id, name: 'Primary Portfolio' });
    res.status(201).json({ success: true, data: await Holding.create({ portfolioId: portfolio._id, symbol, quantity, averageBuyPrice }) });
  } catch (error) { next(error); }
};

const deleteHolding = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    const holding = await Holding.findOneAndDelete({ _id: req.params.id, portfolioId: portfolio?._id });
    if (!holding) return res.status(404).json({ success: false, message: 'Holding not found.' });
    res.json({ success: true, message: 'Holding removed.' });
  } catch (error) { next(error); }
};

const getWatchlist = async (req, res, next) => {
  try {
    const items = await Watchlist.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    const data = await Promise.all(items.map(async (item) => ({ ...item, quote: await marketDataService.getQuote(item.symbol).catch(() => null) })));
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

const addWatchlist = async (req, res, next) => {
  try {
    const { symbol, companyName, exchange } = req.body;
    if (!symbol) return res.status(400).json({ success: false, message: 'Symbol is required.' });
    const item = await Watchlist.findOneAndUpdate({ userId: req.user._id, symbol: symbol.toUpperCase() }, { userId: req.user._id, symbol, companyName, exchange }, { new: true, upsert: true, setDefaultsOnInsert: true });
    res.status(201).json({ success: true, data: item });
  } catch (error) { next(error); }
};

const deleteWatchlist = async (req, res, next) => {
  try { await Watchlist.findOneAndDelete({ userId: req.user._id, symbol: req.params.symbol.toUpperCase() }); res.json({ success: true, message: 'Watchlist item removed.' }); }
  catch (error) { next(error); }
};

const getAlerts = async (req, res, next) => {
  try { res.json({ success: true, data: await Alert.find({ userId: req.user._id }).sort({ createdAt: -1 }) }); }
  catch (error) { next(error); }
};

const createAlert = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await Alert.create({ ...req.body, userId: req.user._id }) }); }
  catch (error) { next(error); }
};

const deleteAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found.' });
    res.json({ success: true, message: 'Alert removed.' });
  } catch (error) { next(error); }
};

module.exports = { getPortfolio, addHolding, deleteHolding, getWatchlist, addWatchlist, deleteWatchlist, getAlerts, createAlert, deleteAlert };