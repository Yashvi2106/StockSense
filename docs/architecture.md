# Architecture Overview — StockSense

## System Topology

```text
               +----------------------------------+
               |      React 18 Single Page App    |
               |      (Vite + Tailwind CSS)       |
               +-----------------+----------------+
                                 |
                                 | HTTP / REST (JWT Auth)
                                 v
               +-----------------+----------------+
               |     Node.js / Express Server     |
               |     (API Gateway & Controller)   |
               +--------+------------------+------+
                        |                  |
              Mongoose  |                  | Internal REST
             Protocols  |                  | (Private)
                        v                  v
       +----------------+-----+   +--------+-----------------+
       |   MongoDB Database   |   |   FastAPI Python Service |
       |   (Local / Atlas /   |   |   (XGBoost / Risk / NLP) |
       |    In-Memory Fallback)   +--------------------------+
       +----------------------+
```

### 1. Frontend Layer
- Single Page Application with React 18, Vite, React Router 6, and Tailwind CSS.
- Communicates exclusively with the Node.js API gateway.
- Visual components built with Recharts and Lucide React.

### 2. Primary Backend Layer (Node.js / Express)
- Handles user registration, authentication (JWT/bcrypt), route protection.
- Manages business entities: Stocks, Watchlists, Portfolios, Holdings, Alerts.
- Integrates market data feeds with intelligent caching to avoid rate limits.
- Secure communication bridge to the private Python ML microservice.

### 3. ML & Analytics Microservice (FastAPI)
- High-performance numeric and ML engine using Pandas, NumPy, Scikit-learn, and XGBoost.
- Computes mathematical technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands).
- Evaluates quantitative risk metrics (Volatility, VaR, Sharpe, Beta, Max Drawdown).
- Executes algorithmic backtesting simulations.
- Performs financial sentiment analysis via rule/lexicon-based NLP.
