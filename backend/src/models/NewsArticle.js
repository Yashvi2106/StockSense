const mongoose = require('mongoose');

const newsArticleSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    url: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: 'Market Feed'
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral'
    },
    sentimentScore: {
      type: Number,
      default: 0
    },
    confidence: {
      type: Number,
      default: 0.5
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate articles for the same stock
newsArticleSchema.index({ symbol: 1, title: 1 }, { unique: true });

const NewsArticle = mongoose.model('NewsArticle', newsArticleSchema);
module.exports = NewsArticle;
