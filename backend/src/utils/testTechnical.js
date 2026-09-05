const http = require('http');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db');

function request(server, path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: server.address().port,
        path,
        method: 'GET'
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function testTechnical() {
  console.log('[Technical-Test] Verifying Technical Indicators & Scoring API...');
  let server;
  try {
    await connectDB();
    server = app.listen(0);

    // 1. Test /api/stocks/TCS/technical
    console.log('[Technical-Test] 1. Requesting GET /api/stocks/TCS/technical ...');
    const resTech = await request(server, '/api/stocks/TCS/technical');
    if (resTech.status !== 200 || !resTech.body.scoring) {
      throw new Error(`Technical API failed: ${JSON.stringify(resTech.body)}`);
    }

    const { indicators, scoring } = resTech.body;
    console.log(`[Technical-Test] Technical Score: ${scoring.technicalScore}/100 (Signal: ${scoring.signal})`);
    console.log(`[Technical-Test] Sub-scores: Trend=${scoring.components.trend}, Momentum=${scoring.components.momentum}, Volatility=${scoring.components.volatility}, Volume=${scoring.components.volume}`);
    console.log(`[Technical-Test] Latest Indicators: SMA20=${indicators.sma20}, EMA20=${indicators.ema20}, RSI14=${indicators.rsi}, MACD=${indicators.macd}, BB=[${indicators.bbLower} - ${indicators.bbUpper}]`);

    // 2. Test /api/stocks/TCS/charts
    console.log('[Technical-Test] 2. Requesting GET /api/stocks/TCS/charts?range=1M ...');
    const resChart = await request(server, '/api/stocks/TCS/charts?range=1M');
    if (resChart.status !== 200 || !resChart.body.candles || resChart.body.candles.length === 0) {
      throw new Error(`Charts API failed: ${JSON.stringify(resChart.body)}`);
    }

    const firstCandle = resChart.body.candles[0];
    const lastCandle = resChart.body.candles[resChart.body.candles.length - 1];
    console.log(`[Technical-Test] Chart candles: ${resChart.body.candles.length} points returned.`);
    console.log(`[Technical-Test] Candle 0 date: ${firstCandle.date}, close: ${firstCandle.close}`);
    console.log(`[Technical-Test] Last candle date: ${lastCandle.date}, close: ${lastCandle.close}, SMA20: ${lastCandle.sma20}, RSI: ${lastCandle.rsi}`);

    console.log('[Technical-Test] ALL TECHNICAL INDICATOR TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('[Technical-Test] FAILED:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await disconnectDB();
    console.log('[Technical-Test] Disconnected.');
    process.exit(0);
  }
}

if (require.main === module) {
  testTechnical();
}

module.exports = testTechnical;
