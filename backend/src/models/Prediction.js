const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true
    },
    predictionDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    forecastDate: {
      type: Date,
      required: true,
      index: true
    },
    currentPrice: {
      type: Number,
      required: true
    },
    predictedPrice: {
      type: Number,
      required: true
    },
    predictedReturn: {
      type: Number,
      default: 0
    },
    lowerRange: {
      type: Number,
      required: true
    },
    upperRange: {
      type: Number,
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    modelName: {
      type: String,
      required: true,
      default: 'XGBoost'
    },
    modelVersion: {
      type: String,
      default: '1.0.0'
    },
    importantFactors: [
      {
        type: String
      }
    ],
    riskFactors: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

const Prediction = mongoose.model('Prediction', predictionSchema);
module.exports = Prediction;
