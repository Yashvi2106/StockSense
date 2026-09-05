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
