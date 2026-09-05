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
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
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

async function testStocks() {
  console.log('[Stock-Test] Starting Market Data API integration tests...');
  let server;
  try {
    await connectDB();
    server = app.listen(0);

    // 1. Test Search
    console.log('[Stock-Test] 1. Testing GET /api/stocks/search?q=TCS ...');
    const searchRes = await request(server, '/api/stocks/search?q=TCS');
    if (searchRes.status !== 200 || !searchRes.body.data || searchRes.body.data.length === 0) {
      throw new Error(`Search failed: ${JSON.stringify(searchRes.body)}`);
    }
    console.log(`[Stock-Test] Search OK. Found ${searchRes.body.data.length} matches. Top: ${searchRes.body.data[0].symbol} - ${searchRes.body.data[0].companyName}`);

    // 2. Test Quote for TCS
    console.log('[Stock-Test] 2. Testing GET /api/stocks/TCS ...');
    const quoteRes = await request(server, '/api/stocks/TCS');
    if (quoteRes.status !== 200 || !quoteRes.body.data || !quoteRes.body.data.currentPrice) {
      throw new Error(`Quote failed: ${JSON.stringify(quoteRes.body)}`);
    }
    const q = quoteRes.body.data;
    console.log(`[Stock-Test] Quote OK: ${q.symbol} Price: ${q.currentPrice} ${q.currency || 'INR'} (Change: ${q.change >= 0 ? '+' : ''}${q.change} / ${q.changePercent}%)`);

    // 3. Test Historical OHLCV (1M)
    console.log('[Stock-Test] 3. Testing GET /api/stocks/TCS/history?range=1M ...');
    const historyRes = await request(server, '/api/stocks/TCS/history?range=1M');
    if (historyRes.status !== 200 || !historyRes.body.data || historyRes.body.data.length === 0) {
      throw new Error(`History failed: ${JSON.stringify(historyRes.body)}`);
    }
    const firstCandle = historyRes.body.data[0];
    const lastCandle = historyRes.body.data[historyRes.body.data.length - 1];
    console.log(`[Stock-Test] History OK: ${historyRes.body.data.length} candles returned.`);
    console.log(`[Stock-Test] Sample candle: Date=${lastCandle.date}, Open=${lastCandle.open}, High=${lastCandle.high}, Low=${lastCandle.low}, Close=${lastCandle.close}, Volume=${lastCandle.volume}`);

    // 4. Test Market Overview
    console.log('[Stock-Test] 4. Testing GET /api/stocks/market/overview ...');
    const overviewRes = await request(server, '/api/stocks/market/overview');
    if (overviewRes.status !== 200 || !overviewRes.body.data?.indices) {
      throw new Error(`Market overview failed: ${JSON.stringify(overviewRes.body)}`);
    }
    console.log(`[Stock-Test] Market overview OK. ${overviewRes.body.data.indices.length} indices and ${overviewRes.body.data.movers.length} movers tracked.`);

    // 5. Test US Ticker AAPL
    console.log('[Stock-Test] 5. Testing GET /api/stocks/AAPL ...');
    const aaplRes = await request(server, '/api/stocks/AAPL');
    if (aaplRes.status !== 200 || !aaplRes.body.data?.currentPrice) {
      throw new Error(`AAPL Quote failed: ${JSON.stringify(aaplRes.body)}`);
    }
    console.log(`[Stock-Test] AAPL Quote OK: $${aaplRes.body.data.currentPrice}`);

    console.log('[Stock-Test] ALL MARKET DATA TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('[Stock-Test] FAILED:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await disconnectDB();
    console.log('[Stock-Test] Disconnected.');
    process.exit(0);
  }
}

if (require.main === module) {
  testStocks();
}

module.exports = testStocks;
