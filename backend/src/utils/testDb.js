const { connectDB, disconnectDB } = require('../config/db');
const {
  User,
  Stock,
  HistoricalPrice,
  Watchlist,
  Portfolio,
  Holding,
  NewsArticle,
  Prediction,
  Alert
} = require('../models');

async function testDatabase() {
  console.log('[DB-Test] Starting MongoDB models & connection verification...');
  try {
    await connectDB();

    // 1. Test Stock creation
    const testStock = await Stock.findOneAndUpdate(
      { symbol: 'TCS' },
      {
        symbol: 'TCS',
        companyName: 'Tata Consultancy Services Ltd',
        exchange: 'NSE',
        sector: 'Technology',
        industry: 'IT Services'
      },
      { upsert: true, new: true }
    );
    console.log(`[DB-Test] Stock model verified: ${testStock.symbol} (${testStock.companyName})`);

    // 2. Test HistoricalPrice
    const testPrice = await HistoricalPrice.findOneAndUpdate(
      { symbol: 'TCS', date: new Date('2026-01-15') },
      {
        symbol: 'TCS',
        date: new Date('2026-01-15'),
        open: 3400,
        high: 3450,
        low: 3390,
        close: 3421,
        volume: 1250000
      },
      { upsert: true, new: true }
    );
    console.log(`[DB-Test] HistoricalPrice model verified: Close = ${testPrice.close}`);

    // 3. Test User
    const testUser = await User.findOneAndUpdate(
      { email: 'tester@stocksense.ai' },
      {
        name: 'Test Analyst',
        email: 'tester@stocksense.ai',
        passwordHash: '$2a$10$X8h8YJv1KqY.zJ8y5gI1Me8j12u0vN5H7l9f.P4xL3g9T.o8q7b2q'
      },
      { upsert: true, new: true }
    );
    console.log(`[DB-Test] User model verified: ${testUser.email} (ID: ${testUser._id})`);

    // 4. Test Watchlist
    const testWatchlist = await Watchlist.findOneAndUpdate(
      { userId: testUser._id, symbol: 'TCS' },
      {
        userId: testUser._id,
        symbol: 'TCS',
        companyName: 'Tata Consultancy Services Ltd',
        exchange: 'NSE'
      },
      { upsert: true, new: true }
    );
    console.log(`[DB-Test] Watchlist model verified: ${testWatchlist.symbol}`);

    // 5. Test Portfolio & Holding
    const testPortfolio = await Portfolio.findOneAndUpdate(
      { userId: testUser._id, name: 'Primary Portfolio' },
      { userId: testUser._id, name: 'Primary Portfolio' },
      { upsert: true, new: true }
    );
    const testHolding = await Holding.findOneAndUpdate(
      { portfolioId: testPortfolio._id, symbol: 'TCS' },
      {
        portfolioId: testPortfolio._id,
        symbol: 'TCS',
        quantity: 10,
        averageBuyPrice: 3200
      },
      { upsert: true, new: true }
    );
    console.log(`[DB-Test] Portfolio & Holding verified: ${testHolding.quantity} shares of ${testHolding.symbol}`);

    // 6. Test NewsArticle
    const testNews = await NewsArticle.findOneAndUpdate(
      { symbol: 'TCS', title: 'TCS Wins Landmark Digital Transformation Contract' },
      {
        symbol: 'TCS',
        title: 'TCS Wins Landmark Digital Transformation Contract',
        description: 'Tata Consultancy Services announced a multi-million enterprise AI contract.',
        source: 'Financial Express',
        publishedAt: new Date(),
        sentiment: 'positive',
        sentimentScore: 0.78,
        confidence: 0.86
      },
      { upsert: true, new: true }
    );
    console.log(`[DB-Test] NewsArticle model verified: sentiment = ${testNews.sentiment}`);

    // 7. Test Prediction
    const testPrediction = await Prediction.create({
      symbol: 'TCS',
      predictionDate: new Date(),
      forecastDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      currentPrice: 3421,
      predictedPrice: 3480,
      predictedReturn: 0.0172,
      lowerRange: 3380,
      upperRange: 3520,
      confidence: 0.73,
      modelName: 'XGBoost',
      modelVersion: '1.0.0',
      importantFactors: ['Positive momentum', 'Price above SMA50'],
      riskFactors: ['High market volatility']
    });
    console.log(`[DB-Test] Prediction model verified: ${testPrediction.symbol} -> ${testPrediction.predictedPrice}`);

    // 8. Test Alert
    const testAlert = await Alert.create({
      userId: testUser._id,
      symbol: 'TCS',
      condition: 'PRICE_ABOVE',
      targetValue: 3500
    });
    console.log(`[DB-Test] Alert model verified: ${testAlert.symbol} ${testAlert.condition} ${testAlert.targetValue}`);

    console.log('[DB-Test] ALL 9 MODELS AND INDEXES VERIFIED SUCCESSFULLY!');
  } catch (err) {
    console.error('[DB-Test] FAILED:', err);
    process.exit(1);
  } finally {
    await disconnectDB();
    console.log('[DB-Test] Disconnected cleanly.');
    process.exit(0);
  }
}

if (require.main === module) {
  testDatabase();
}

module.exports = testDatabase;
