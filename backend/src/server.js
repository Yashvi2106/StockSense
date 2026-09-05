const app = require('./app');
const config = require('./config/env');

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`[StockSense Backend] Running on http://localhost:${PORT} in ${config.nodeEnv} mode`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});
