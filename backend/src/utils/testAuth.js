const http = require('http');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db');
const { User, Portfolio } = require('../models');

function request(server, path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    if (payload) {
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: server.address().port,
        path,
        method,
        headers: reqHeaders
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
    if (payload) req.write(payload);
    req.end();
  });
}

async function testAuth() {
  console.log('[Auth-Test] Starting Authentication integration tests...');
  let server;
  try {
    await connectDB();
    server = app.listen(0); // Listen on random available port
    const testEmail = `trader_${Date.now()}@stocksense.ai`;

    // 1. Test Register
    console.log('[Auth-Test] 1. Testing user registration...');
    const regRes = await request(server, '/api/auth/register', 'POST', {
      name: 'Rohan Sharma',
      email: testEmail,
      password: 'SecurePassword123!'
    });

    if (regRes.status !== 201 || !regRes.body.token) {
      throw new Error(`Register failed: ${JSON.stringify(regRes.body)}`);
    }
    const token = regRes.body.token;
    console.log(`[Auth-Test] Register OK. User ID: ${regRes.body.user.id}, Token received.`);

    // Verify auto-created portfolio
    const portfolio = await Portfolio.findOne({ userId: regRes.body.user.id });
    if (!portfolio) throw new Error('Default portfolio was not auto-created for new user!');
    console.log(`[Auth-Test] Default portfolio verified: "${portfolio.name}"`);

    // 2. Test Duplicate Register
    console.log('[Auth-Test] 2. Testing duplicate registration rejection...');
    const dupRes = await request(server, '/api/auth/register', 'POST', {
      name: 'Rohan Sharma Duplicate',
      email: testEmail,
      password: 'SecurePassword123!'
    });
    if (dupRes.status !== 400) {
      throw new Error(`Duplicate check failed: expected 400, got ${dupRes.status}`);
    }
    console.log('[Auth-Test] Duplicate registration properly rejected with 400.');

    // 3. Test Login
    console.log('[Auth-Test] 3. Testing user login...');
    const loginRes = await request(server, '/api/auth/login', 'POST', {
      email: testEmail,
      password: 'SecurePassword123!'
    });
    if (loginRes.status !== 200 || !loginRes.body.token) {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
    }
    console.log('[Auth-Test] Login OK. Token verified.');

    // 4. Test Invalid Password
    console.log('[Auth-Test] 4. Testing invalid password rejection...');
    const badLoginRes = await request(server, '/api/auth/login', 'POST', {
      email: testEmail,
      password: 'WrongPassword!'
    });
    if (badLoginRes.status !== 401) {
      throw new Error(`Invalid password check failed: expected 401, got ${badLoginRes.status}`);
    }
    console.log('[Auth-Test] Invalid password properly rejected with 401.');

    // 5. Test Protected Route: GET /api/auth/me
    console.log('[Auth-Test] 5. Testing protected route /api/auth/me with Bearer token...');
    const meRes = await request(server, '/api/auth/me', 'GET', null, {
      Authorization: `Bearer ${token}`
    });
    if (meRes.status !== 200 || meRes.body.user.email !== testEmail) {
      throw new Error(`Protected route /me failed: ${JSON.stringify(meRes.body)}`);
    }
    console.log(`[Auth-Test] Protected route OK. Authenticated user: ${meRes.body.user.name}`);

    // 6. Test Protected Route Without Token
    console.log('[Auth-Test] 6. Testing protected route rejection without token...');
    const noTokenRes = await request(server, '/api/auth/me', 'GET');
    if (noTokenRes.status !== 401) {
      throw new Error(`Unauthenticated request check failed: expected 401, got ${noTokenRes.status}`);
    }
    console.log('[Auth-Test] Request without token properly rejected with 401.');

    // 7. Test Preferences Update
    console.log('[Auth-Test] 7. Testing preferences update...');
    const prefRes = await request(server, '/api/auth/preferences', 'PUT', {
      theme: 'light',
      currency: 'USD'
    }, {
      Authorization: `Bearer ${token}`
    });
    if (prefRes.status !== 200 || prefRes.body.preferences.currency !== 'USD') {
      throw new Error(`Preferences update failed: ${JSON.stringify(prefRes.body)}`);
    }
    console.log(`[Auth-Test] Preferences update OK: theme=${prefRes.body.preferences.theme}, currency=${prefRes.body.preferences.currency}`);

    // 8. Test Logout
    console.log('[Auth-Test] 8. Testing logout endpoint...');
    const logoutRes = await request(server, '/api/auth/logout', 'POST');
    if (logoutRes.status !== 200) {
      throw new Error(`Logout failed: ${JSON.stringify(logoutRes.body)}`);
    }
    console.log('[Auth-Test] Logout OK.');

    console.log('[Auth-Test] ALL AUTHENTICATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('[Auth-Test] FAILED:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await disconnectDB();
    console.log('[Auth-Test] Cleanup complete.');
    process.exit(0);
  }
}

if (require.main === module) {
  testAuth();
}

module.exports = testAuth;
