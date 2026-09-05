# Machine Learning & Quantitative Analytics Specification

## Methodology

StockSense uses machine learning to forecast **future returns** rather than naive non-stationary raw stock prices.

### Target Formulation
$$\text{Future Return}_{t, 7} = \frac{Close_{t+7} - Close_{t}}{Close_t}$$

From predicted future returns, expected price bounds are calculated using confidence intervals and historical volatility:
$$\text{Predicted Price} = Close_t \times (1 + \hat{r})$$
$$\text{Range} = [\text{Predicted Price} \times (1 - z \cdot \sigma), \text{Predicted Price} \times (1 + z \cdot \sigma)]$$

### Engineered Feature Matrix
1. **Trend & Moving Averages**:
   - SMA ratios: $Close / SMA_{20}$, $Close / SMA_{50}$, $Close / SMA_{200}$
   - EMA ratios: $Close / EMA_{20}$, $Close / EMA_{50}$
2. **Momentum & Oscillators**:
   - Relative Strength Index ($RSI_{14}$)
   - MACD line, Signal line, Histogram
   - Rate of change / Momentum over 5, 10, 20 days
3. **Volatility**:
   - Bollinger Band %B and BandWidth
   - 20-day annualized rolling volatility
4. **Volume Dynamics**:
   - Volume / 20-day Volume Moving Average
5. **Autoregressive Lag Features**:
   - `return_lag_1`, `return_lag_3`, `return_lag_5`, `return_lag_7`

### Time-Series Validation (No Lookahead Bias)
- Shuffling time-series data creates lookahead leakage.
- TimeSeriesSplit / rolling chronological out-of-sample splits are strictly enforced.
- Evaluated on: MAE, RMSE, MAPE, and Directional Accuracy.
