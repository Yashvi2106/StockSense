import pandas as pd
import numpy as np

FEATURE_COLUMNS = [
    'return_1d', 'return_5d', 'momentum_10',
    'price_to_sma20', 'price_to_sma50', 'sma20_to_sma50',
    'rsi_14', 'macd', 'macd_signal', 'macd_hist',
    'volatility_20', 'bb_bandwidth', 'volume_ratio',
    'close_lag_1', 'close_lag_3', 'close_lag_5', 'close_lag_7'
]

def compute_rsi_series(series: pd.Series, period: int = 14) -> pd.Series:
    delta = series.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.rolling(window=period, min_periods=period).mean()
    avg_loss = loss.rolling(window=period, min_periods=period).mean()

    rs = avg_gain / avg_loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50.0)

def compute_macd_series(series: pd.Series):
    ema12 = series.ewm(span=12, adjust=False).mean()
    ema26 = series.ewm(span=26, adjust=False).mean()
    macd_line = ema12 - ema26
    signal_line = macd_line.ewm(span=9, adjust=False).mean()
    histogram = macd_line - signal_line
    return macd_line, signal_line, histogram

def build_features(df: pd.DataFrame, forecast_horizon: int = 7) -> pd.DataFrame:
    """
    Computes technical indicators, lag features, and forward returns.
    df must have columns: ['open', 'high', 'low', 'close', 'volume'] sorted by date ascending.
    """
    data = df.copy()
    for col in ['open', 'high', 'low', 'close', 'volume']:
        data[col] = pd.to_numeric(data[col], errors='coerce')

    data = data.sort_index().ffill().bfill()

    # 1. Immediate returns & momentum
    data['return_1d'] = data['close'].pct_change(1)
    data['return_5d'] = data['close'].pct_change(5)
    data['momentum_10'] = (data['close'] / data['close'].shift(10)) - 1.0

    # 2. Moving Averages
    data['sma_20'] = data['close'].rolling(window=20).mean()
    data['sma_50'] = data['close'].rolling(window=50).mean()
    data['ema_20'] = data['close'].ewm(span=20, adjust=False).mean()

    # Ratio features (stationary)
    data['price_to_sma20'] = (data['close'] / data['sma_20']) - 1.0
    data['price_to_sma50'] = (data['close'] / data['sma_50']) - 1.0
    data['sma20_to_sma50'] = (data['sma_20'] / data['sma_50']) - 1.0

    # 3. Oscillators
    data['rsi_14'] = compute_rsi_series(data['close'], 14) / 100.0  # normalize 0 to 1
    macd_line, signal_line, hist = compute_macd_series(data['close'])
    data['macd'] = macd_line / data['close']
    data['macd_signal'] = signal_line / data['close']
    data['macd_hist'] = hist / data['close']

    # 4. Volatility & Bollinger Bands
    rolling_std_20 = data['close'].rolling(window=20).std()
    data['volatility_20'] = (rolling_std_20 / data['close']) * np.sqrt(252)
    bb_upper = data['sma_20'] + (2 * rolling_std_20)
    bb_lower = data['sma_20'] - (2 * rolling_std_20)
    data['bb_bandwidth'] = (bb_upper - bb_lower) / data['sma_20']

    # 5. Volume dynamics
    vol_ma20 = data['volume'].rolling(window=20).mean()
    data['volume_ratio'] = data['volume'] / vol_ma20.replace(0, np.nan)

    # 6. Autoregressive Lag Features
    data['close_lag_1'] = data['close'].pct_change(1).shift(1)
    data['close_lag_3'] = data['close'].pct_change(3).shift(3)
    data['close_lag_5'] = data['close'].pct_change(5).shift(5)
    data['close_lag_7'] = data['close'].pct_change(7).shift(7)

    # 7. Target: Future Return (forecast_horizon periods ahead)
    data['future_return'] = (data['close'].shift(-forecast_horizon) - data['close']) / data['close']

    return data
