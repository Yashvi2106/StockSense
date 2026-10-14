const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');

const app = express();

// Security and middleware
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const newsRoutes = require('./routes/newsRoutes');
const userDataRoutes = require('./routes/userDataRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Base health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'stocksense-backend',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/news', newsRoutes);
app.use('/api', userDataRoutes);
app.use('/api', analyticsRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  const isRateLimited = err.response?.status === 429 || /too many requests|rate limit/i.test(err.message || '');
  const status = err.statusCode || err.status || (err.code === 'HISTORICAL_NOT_FOUND' ? 404 : isRateLimited ? 429 : err.code === 'ETIMEDOUT' ? 504 : 500);
  const message = err.code === 'STOCK_NOT_FOUND'
    ? 'Stock symbol was not found by the market-data provider.'
    : isRateLimited
      ? 'Market-data provider rate limit reached. Please retry later.'
      : err.message || 'Internal Server Error';
  res.status(status).json({
    success: false,
    message,
    code: err.code || 'MARKET_DATA_ERROR',
    error: config.nodeEnv === 'development' ? err.stack : undefined
  });
});

module.exports = app;
