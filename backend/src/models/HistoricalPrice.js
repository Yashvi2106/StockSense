const mongoose = require('mongoose');

const historicalPriceSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    open: {
      type: Number,
      required: true
    },
    high: {
      type: Number,
      required: true
    },
    low: {
      type: Number,
      required: true
    },
    close: {
      type: Number,
      required: true
    },
    volume: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound index for time-series queries on a stock
historicalPriceSchema.index({ symbol: 1, date: -1 }, { unique: true });

const HistoricalPrice = mongoose.model('HistoricalPrice', historicalPriceSchema);
module.exports = HistoricalPrice;
