const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    exchange: {
      type: String,
      required: [true, 'Exchange is required'],
      uppercase: true,
      default: 'NSE'
    },
    sector: {
      type: String,
      default: 'General'
    },
    industry: {
      type: String,
      default: 'General'
    },
    currentPrice: {
      type: Number,
      min: 0
    },
    previousClose: {
      type: Number,
      min: 0
    },
    open: {
      type: Number,
      min: 0
    },
    high: {
      type: Number,
      min: 0
    },
    low: {
      type: Number,
      min: 0
    },
    volume: {
      type: Number,
      min: 0,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    quoteTimestamp: {
      type: Date
    },
    fetchedAt: {
      type: Date
    },
    dataSource: {
      type: String
    },
    dataStatus: {
      type: String,
      enum: ['LIVE', 'DELAYED', 'LATEST_AVAILABLE']
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Stock = mongoose.model('Stock', stockSchema);
module.exports = Stock;
