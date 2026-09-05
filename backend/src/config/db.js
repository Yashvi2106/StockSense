const mongoose = require('mongoose');
const config = require('./env');

let mongodInstance = null;

const connectDB = async () => {
  try {
    // Attempt standard connection first with 3s timeout
    mongoose.set('strictQuery', false);
    
    console.log(`[MongoDB] Connecting to ${config.mongoUri}...`);
    try {
      const conn = await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`[MongoDB] Connected to database: ${conn.connection.host}`);
      return conn;
    } catch (directErr) {
      console.warn(`[MongoDB] Direct connection to ${config.mongoUri} failed: ${directErr.message}`);
      
      // Fallback to in-memory MongoDB in development
      if (config.nodeEnv === 'development' || config.nodeEnv === 'test') {
        console.log('[MongoDB] Starting in-memory MongoDB runner for local development...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const memUri = mongodInstance.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`[MongoDB] Connected to in-memory MongoDB at: ${memUri}`);
        return conn;
      } else {
        throw directErr;
      }
    }
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    throw error;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
