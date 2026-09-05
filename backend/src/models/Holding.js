const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema(
  {
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio',
      required: true,
      index: true
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [0.0001, 'Quantity must be greater than zero']
    },
    averageBuyPrice: {
      type: Number,
      required: true,
      min: [0.01, 'Average buy price must be greater than zero']
    }
  },
  {
    timestamps: true
  }
);

const Holding = mongoose.model('Holding', holdingSchema);
module.exports = Holding;
