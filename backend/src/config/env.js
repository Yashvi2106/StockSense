const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stocksense',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_key_12345',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000',
  marketDataApiKey: process.env.MARKET_DATA_API_KEY || '',
  newsApiKey: process.env.NEWS_API_KEY || ''
};
