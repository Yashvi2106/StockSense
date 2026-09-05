# API Specification — StockSense

All API endpoints (except public health and auth routes) require an `Authorization: Bearer <token>` JWT header.

## Base URL
- Node.js API Gateway: `http://localhost:5000/api`
- Internal ML Microservice: `http://localhost:8000` (internal only)

## Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name, email, password`)
- `POST /api/auth/login` — Authenticate and receive JWT token (`email, password`)
- `GET  /api/auth/me` — Retrieve current authenticated user profile
- `POST /api/auth/logout` — Invalidate client session

### Stock Intelligence (`/api/stocks`)
- `GET  /api/stocks/search?q=:query` — Search stocks by ticker or company name
- `GET  /api/stocks/:symbol` — Current stock quote and metadata
- `GET  /api/stocks/:symbol/history?range=1M` — Historical OHLCV series (1D, 1W, 1M, 3M, 6M, 1Y, 5Y)
- `GET  /api/stocks/:symbol/technical` — Calculated technical indicators and score
- `GET  /api/stocks/:symbol/prediction` — ML forecast range, confidence, and factors
- `GET  /api/stocks/:symbol/risk` — Institutional risk breakdown and composite score
- `GET  /api/stocks/:symbol/ai-summary` — Multi-factor explainable intelligence summary

### News & Sentiment (`/api/news`)
- `GET  /api/news/:symbol` — Recent news articles with sentiment classifications
- `GET  /api/news/market` — General market headline sentiment

### Watchlist (`/api/watchlist`)
- `GET    /api/watchlist` — Get current user's tracked watchlist
- `POST   /api/watchlist` — Add stock symbol to watchlist
- `DELETE /api/watchlist/:symbol` — Remove stock from watchlist

### Portfolio Tracker (`/api/portfolio`)
- `GET    /api/portfolio` — Fetch user portfolio and holdings with computed metrics
- `POST   /api/portfolio/holdings` — Add a holding (`symbol, quantity, averageBuyPrice`)
- `DELETE /api/portfolio/holdings/:id` — Remove a holding

### Backtesting Engine (`/api/backtest`)
- `POST   /api/backtest` — Run strategy backtest (`symbol, strategy, initialCapital, startDate, endDate`)

### Alerts (`/api/alerts`)
- `GET    /api/alerts` — Fetch user alerts
- `POST   /api/alerts` — Create alert (`symbol, condition, targetValue`)
- `DELETE /api/alerts/:id` — Delete alert
