# Architecture Overview — StockSense

## System Topology

```

### Market Quote Flow
               |      (Vite + Tailwind CSS)       |
       Market Data Provider -> Node MarketDataService -> normalized quote
                                                                        |              |
                                                                        |              +-> current price, OHLC, volume, timestamp
                                                                        +-> MongoDB Stock / HistoricalPrice cache
                                                                        |
                                                                        +-> REST response -> React Dashboard
```
                        |           | Internal REST
                        |           v
                        |  +--------+-----------------+
                        |  | FastAPI Python Service  |
                        |  | (XGBoost / Risk / NLP)  |
                        |  +--------------------------+
                        v
       +----------------+----------------------+
       |        Market Data Service            |
       | provider -> normalize -> cache        |
       +----------------+----------------------+
                        |
                        v
       +----------------+----------------------+
       |   MongoDB (Local / Atlas / Memory)    |
       | quote cache + historical OHLCV cache  |
       +---------------------------------------+

Market quote flow:

```text
Market Data Provider -> Node MarketDataService -> normalized quote
                                      |              |
                                      |              +-> current price, OHLC, volume, timestamp
                                      +-> MongoDB Stock / HistoricalPrice cache
                                      |
                                      +-> REST response -> React Dashboard
```
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
