const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/db');

const PORT = config.port;

const startServer = async () => {
  try {
    await Promise.race([
      connectDB(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Database startup timed out')), 8000))
    ]);
  } catch (error) {
    console.warn(`[StockSense Backend] Starting without database: ${error.message}`);
  }

  const server = app.listen(PORT, () => {
    console.log(`[StockSense Backend] Running on http://localhost:${PORT} in ${config.nodeEnv} mode`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection! Shutting down...', err);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
