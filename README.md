# StockSense — AI-Powered Stock Intelligence & Market Analytics Platform

> An educational and analytical intelligence platform answering **"Why is this stock behaving this way?"** using multi-factor synthesis: technical indicators, news sentiment NLP, machine learning forecasting, risk metrics, backtesting, and explainable summaries.

---

## Key Features

- **Holistic Stock Intelligence**: Integrates price action, technical analysis, news sentiment, risk analytics, and ML predictions in one view.
- **Explainable ML Predictions**: XGBoost and Random Forest forecasting with feature attribution rather than black-box guesses.
- **Financial News NLP**: Real-time news sentiment classification, confidence scores, and sentiment breakdowns.
- **Institutional Risk Engine**: Value at Risk (VaR 95%), Sharpe Ratio, Maximum Drawdown, Beta, and Historical Volatility.
- **Algorithmic Backtesting**: Simulate and visualize trading strategies (SMA Crossover, RSI Reversal, Buy & Hold).
- **Portfolio & Watchlist Management**: Track simulated allocations and performance with live P&L and risk profiles.
- **Smart Alerts Engine**: In-app threshold triggers on price action and technical indicators.

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Axios
- **Main Backend**: Node.js, Express.js, Mongoose, JWT, bcrypt, Helmet, Morgan
- **Database**: MongoDB / MongoDB Atlas (with automatic in-memory fallback for local dev)
- **ML / NLP Service**: Python, FastAPI, Uvicorn, Pandas, NumPy, Scikit-learn, XGBoost, Joblib

---

## Project Structure

```text
Stock/
├── frontend/        # React + Vite client
├── backend/         # Express.js REST API & business logic
├── ml-service/      # Python FastAPI predictive & risk analytics
├── docs/            # System & API documentation
├── docker-compose.yml
└── README.md
```

---

## Disclaimer

**Educational and Research Purpose Only**: StockSense is designed for financial education and quantitative research. It does NOT execute real trades, handle brokerage connections, or provide guaranteed financial advice.
