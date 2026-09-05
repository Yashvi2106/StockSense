const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true
    },
    condition: {
      type: String,
      required: true,
      enum: ['PRICE_ABOVE', 'PRICE_BELOW', 'RSI_ABOVE', 'RSI_BELOW']
    },
    targetValue: {
      type: Number,
      required: true
    },
    isTriggered: {
      type: Boolean,
      default: false
    },
    triggeredAt: {
      type: Date
    },
    triggeredValue: {
      type: Number
    },
    message: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;
