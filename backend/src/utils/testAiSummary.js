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

async function testAiSummary() {
  console.log('[AI-Summary-Test] Verifying AI Market Summary API...');
  let server;
  try {
    await connectDB();
    server = app.listen(0);

    console.log('[AI-Summary-Test] Requesting GET /api/stocks/TCS/ai-summary ...');
    const res = await request(server, '/api/stocks/TCS/ai-summary');
    if (res.status !== 200 || !res.body.overallSignal) {
      throw new Error(`AI Summary API failed: status=${res.status}, body=${JSON.stringify(res.body)}`);
    }

    console.log(`[AI-Summary-Test] Success! Overall Signal: ${res.body.overallSignal}`);
    console.log(`[AI-Summary-Test] Technical Score: ${res.body.technicalScore}`);
    console.log(`[AI-Summary-Test] Positive Factors (${res.body.positiveFactors?.length}):`, res.body.positiveFactors);
    console.log(`[AI-Summary-Test] Risk Factors (${res.body.riskFactors?.length}):`, res.body.riskFactors);
    console.log(`[AI-Summary-Test] Executive Summary: ${res.body.executiveSummary}`);

    console.log('[AI-Summary-Test] ALL AI SUMMARY TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('[AI-Summary-Test] FAILED:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await disconnectDB();
    console.log('[AI-Summary-Test] Disconnected.');
    process.exit(0);
  }
}

if (require.main === module) {
  testAiSummary();
}

module.exports = testAiSummary;
