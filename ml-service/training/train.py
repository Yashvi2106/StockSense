import os
import sys
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from training.feature_engineering import build_features

FEATURE_COLUMNS = [
    'return_1d', 'return_5d', 'momentum_10',
    'price_to_sma20', 'price_to_sma50', 'sma20_to_sma50',
    'rsi_14', 'macd', 'macd_signal', 'macd_hist',
    'volatility_20', 'bb_bandwidth', 'volume_ratio',
    'close_lag_1', 'close_lag_3', 'close_lag_5', 'close_lag_7'
]

def generate_training_data(periods: int = 800) -> pd.DataFrame:
    """
    Generates training data or downloads market history
    """
    import yfinance as yf
    print("[Train] Fetching benchmark training dataset...")
    try:
        ticker = yf.Ticker("TCS.NS")
        hist = ticker.history(period="3y")
        if hist is not None and len(hist) > 200:
            df = hist.rename(columns={
                'Open': 'open', 'High': 'high', 'Low': 'low', 'Close': 'close', 'Volume': 'volume'
            })[['open', 'high', 'low', 'close', 'volume']]
            print(f"[Train] Successfully loaded {len(df)} live trading bars from Yahoo Finance.")
            return df
    except Exception as e:
        print(f"[Train] Yahoo Finance download failed ({e}). Synthesizing realistic geometric Brownian dataset.")

    # High quality geometric Brownian dataset
    np.random.seed(42)
    dates = pd.date_range(end=pd.Timestamp.today(), periods=periods, freq='B')
    initial_price = 3000.0
    mu = 0.0004  # annualized 10% drift
    sigma = 0.015 # daily volatility

    returns = np.random.normal(mu, sigma, size=periods)
    price_series = initial_price * np.cumprod(1 + returns)

    highs = price_series * (1 + np.abs(np.random.normal(0, 0.008, size=periods)))
    lows = price_series * (1 - np.abs(np.random.normal(0, 0.008, size=periods)))
    opens = price_series * (1 + np.random.normal(0, 0.005, size=periods))
    volumes = np.random.randint(600000, 2500000, size=periods)

    df = pd.DataFrame({
        'open': opens,
        'high': highs,
        'low': lows,
        'close': price_series,
        'volume': volumes
    }, index=dates)

    return df

def train_and_evaluate():
    raw_df = generate_training_data()
    feature_df = build_features(raw_df, forecast_horizon=7)

    # Clean missing values resulting from rolling windows & target shift
    clean_df = feature_df.dropna(subset=FEATURE_COLUMNS + ['future_return']).copy()
    clean_df = clean_df.replace([np.inf, -np.inf], 0.0)

    X = clean_df[FEATURE_COLUMNS].values
    y = clean_df['future_return'].values

    # Time-series aware chronological split: 80% train, 20% test (NO SHUFFLE)
    split_idx = int(len(clean_df) * 0.8)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]

    print(f"[Train] Dataset split: {len(X_train)} training bars, {len(X_test)} out-of-sample test bars.")

    # 1. Random Forest
    rf = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    rf_preds = rf.predict(X_test)
    rf_mae = mean_absolute_error(y_test, rf_preds)
    rf_rmse = np.sqrt(mean_squared_error(y_test, rf_preds))
    rf_acc = np.mean((np.sign(rf_preds) == np.sign(y_test)).astype(int)) * 100

    print(f"[Evaluation - Random Forest] MAE: {rf_mae:.4f} | RMSE: {rf_rmse:.4f} | Directional Acc: {rf_acc:.1f}%")

    # 2. XGBoost
    xgb = XGBRegressor(n_estimators=100, max_depth=4, learning_rate=0.05, subsample=0.8, random_state=42)
    xgb.fit(X_train, y_train)
    xgb_preds = xgb.predict(X_test)
    xgb_mae = mean_absolute_error(y_test, xgb_preds)
    xgb_rmse = np.sqrt(mean_squared_error(y_test, xgb_preds))
    xgb_acc = np.mean((np.sign(xgb_preds) == np.sign(y_test)).astype(int)) * 100

    print(f"[Evaluation - XGBoost]       MAE: {xgb_mae:.4f} | RMSE: {xgb_rmse:.4f} | Directional Acc: {xgb_acc:.1f}%")

    # Pick best model (lower RMSE & higher directional accuracy)
    best_model_name = "XGBoost" if xgb_acc >= rf_acc else "RandomForest"
    best_model = xgb if best_model_name == "XGBoost" else rf
    best_metrics = {
        "model": best_model_name,
        "mae": float(round(xgb_mae if best_model_name == "XGBoost" else rf_mae, 4)),
        "rmse": float(round(xgb_rmse if best_model_name == "XGBoost" else rf_rmse, 4)),
        "directionalAccuracy": float(round(xgb_acc if best_model_name == "XGBoost" else rf_acc, 1)),
        "featureColumns": FEATURE_COLUMNS,
        "trainBars": len(X_train),
        "testBars": len(X_test)
    }

    # Save artifact
    save_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "saved_models")
    os.makedirs(save_dir, exist_ok=True)
    model_file = os.path.join(save_dir, "model.joblib")
    meta_file = os.path.join(save_dir, "metadata.joblib")

    joblib.dump(best_model, model_file)
    joblib.dump(best_metrics, meta_file)
    print(f"[Train] Saved best model ({best_model_name}) and metadata to {save_dir}")

    return best_metrics

if __name__ == "__main__":
    train_and_evaluate()
