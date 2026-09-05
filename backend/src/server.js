const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/db');

const PORT = config.port;

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`[StockSense Backend] Running on http://localhost:${PORT} in ${config.nodeEnv} mode`);
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection! Shutting down...', err);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
