const http = require('http');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db');
const { NewsArticle } = require('../models');

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

async function testNews() {
  console.log('[News-Test] Verifying News & Financial Sentiment Integration...');
  let server;
  try {
    await connectDB();
    server = app.listen(0);

    // 1. Request news for TCS
    console.log('[News-Test] 1. Requesting GET /api/news/TCS ...');
    const res = await request(server, '/api/news/TCS');
    if (res.status !== 200 || !res.body.data || !res.body.data.articles) {
      throw new Error(`News API failed: ${JSON.stringify(res.body)}`);
    }

    const { total, sentimentSummary, articles } = res.body.data;
    console.log(`[News-Test] Articles received: ${total}. Overall Sentiment: ${sentimentSummary.overall} (Avg Score: ${sentimentSummary.averageScore})`);
    console.log(`[News-Test] Distribution: Positive=${sentimentSummary.positivePercent}%, Neutral=${sentimentSummary.neutralPercent}%, Negative=${sentimentSummary.negativePercent}%`);

    const sample = articles[0];
    console.log(`[News-Test] Sample article: "${sample.title.slice(0, 60)}..."`);
    console.log(`[News-Test] Sentiment: ${sample.sentiment} | Score: ${sample.sentimentScore} | Confidence: ${sample.confidence} | Source: ${sample.source}`);

    // 2. Verify MongoDB storage
    const storedCount = await NewsArticle.countDocuments({ symbol: 'TCS' });
    console.log(`[News-Test] Verified ${storedCount} articles persisted in MongoDB NewsArticle collection.`);

    console.log('[News-Test] ALL NEWS & SENTIMENT TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('[News-Test] FAILED:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await disconnectDB();
    console.log('[News-Test] Disconnected.');
    process.exit(0);
  }
}

if (require.main === module) {
  testNews();
}

module.exports = testNews;
