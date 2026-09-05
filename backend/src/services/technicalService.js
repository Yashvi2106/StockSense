/**
 * Quantitative Technical Analysis Calculation Service
 */

/**
 * Calculates Simple Moving Average (SMA)
 */
function calculateSMA(data, period) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      result.push(Number((sum / period).toFixed(2)));
    }
  }
  return result;
}

/**
 * Calculates Exponential Moving Average (EMA)
 */
function calculateEMA(data, period) {
  const result = [];
  const k = 2 / (period + 1);
  let prevEMA = null;

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      // First EMA is simple SMA
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[j].close;
      }
      prevEMA = sum / period;
      result.push(Number(prevEMA.toFixed(2)));
    } else {
      const currentClose = data[i].close;
      prevEMA = currentClose * k + prevEMA * (1 - k);
      result.push(Number(prevEMA.toFixed(2)));
    }
  }
  return result;
}

/**
 * Calculates Relative Strength Index (RSI 14)
 */
function calculateRSI(data, period = 14) {
  const result = [];
  if (data.length < period + 1) {
    return data.map(() => 50); // Fallback neutral
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push(null);
    } else if (i === period) {
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);
      result.push(Number(rsi.toFixed(2)));
    } else {
      const diff = data[i].close - data[i - 1].close;
      const currentGain = diff > 0 ? diff : 0;
      const currentLoss = diff < 0 ? Math.abs(diff) : 0;

      avgGain = (avgGain * (period - 1) + currentGain) / period;
      avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);
      result.push(Number(rsi.toFixed(2)));
    }
  }
  return result;
}

/**
 * Calculates Moving Average Convergence Divergence (MACD 12, 26, 9)
 */
function calculateMACD(data) {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);

  const macdLine = [];
  const macdObjects = [];

  for (let i = 0; i < data.length; i++) {
    if (ema12[i] == null || ema26[i] == null) {
      macdLine.push(null);
      macdObjects.push({ close: 0 });
    } else {
      const val = Number((ema12[i] - ema26[i]).toFixed(2));
      macdLine.push(val);
      macdObjects.push({ close: val });
    }
  }

  const signalLine = calculateEMA(macdObjects, 9);
  const histogram = [];

  for (let i = 0; i < data.length; i++) {
    if (macdLine[i] == null || signalLine[i] == null) {
      histogram.push(null);
    } else {
      histogram.push(Number((macdLine[i] - signalLine[i]).toFixed(2)));
    }
  }

  return { macdLine, signalLine, histogram };
}

/**
 * Calculates Bollinger Bands (20, 2)
 */
function calculateBollingerBands(data, period = 20, multiplier = 2) {
  const upper = [];
  const middle = [];
  const lower = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upper.push(null);
      middle.push(null);
      lower.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      const mean = sum / period;

      let variance = 0;
      for (let j = 0; j < period; j++) {
        variance += Math.pow(data[i - j].close - mean, 2);
      }
      const stdDev = Math.sqrt(variance / period);

      middle.push(Number(mean.toFixed(2)));
      upper.push(Number((mean + multiplier * stdDev).toFixed(2)));
      lower.push(Number((mean - multiplier * stdDev).toFixed(2)));
    }
  }

  return { upper, middle, lower };
}

/**
 * Computes composite Technical Score (0 - 100) and factor breakdowns
 */
function evaluateTechnicalScore(candles, latestIndicators) {
  if (!candles || candles.length === 0) {
    return {
      technicalScore: 50,
      signal: 'Neutral',
      components: { momentum: 50, trend: 50, volatility: 50, volume: 50 }
    };
  }

  const latest = candles[candles.length - 1];
  const close = latest.close;

  // 1. Trend Sub-Score (0-100)
  let trendScore = 50;
  if (latestIndicators.sma20 && close > latestIndicators.sma20) trendScore += 15;
  if (latestIndicators.sma50 && close > latestIndicators.sma50) trendScore += 15;
  if (latestIndicators.sma20 && latestIndicators.sma50 && latestIndicators.sma20 > latestIndicators.sma50) trendScore += 10;
  if (latestIndicators.ema20 && close > latestIndicators.ema20) trendScore += 10;
  trendScore = Math.min(Math.max(trendScore, 10), 95);

  // 2. Momentum Sub-Score (0-100)
  let momentumScore = 50;
  const rsi = latestIndicators.rsi ?? 50;
  if (rsi >= 50 && rsi <= 68) momentumScore += 25; // Healthy bullish momentum
  else if (rsi > 68 && rsi <= 75) momentumScore += 15; // Strong but approaching overbought
  else if (rsi > 75) momentumScore -= 10; // Overbought
  else if (rsi < 35) momentumScore -= 20; // Oversold / weak
  else if (rsi < 45) momentumScore -= 10;

  if (latestIndicators.macdHist != null) {
    if (latestIndicators.macdHist > 0) momentumScore += 15;
    else momentumScore -= 15;
  }
  momentumScore = Math.min(Math.max(momentumScore, 10), 95);

  // 3. Volatility Sub-Score (0-100, where higher means healthy, stable volatility)
  let volatilityScore = 60;
  if (latestIndicators.bbUpper && latestIndicators.bbLower && latestIndicators.bbMiddle) {
    const bandwidth = (latestIndicators.bbUpper - latestIndicators.bbLower) / latestIndicators.bbMiddle;
    if (bandwidth > 0.15) volatilityScore = 45; // High volatility
    else if (bandwidth < 0.05) volatilityScore = 75; // Low volatility / squeeze
    else volatilityScore = 65;
  }

  // 4. Volume Sub-Score (0-100)
  let volumeScore = 55;
  const recentVolumes = candles.slice(-20).map((c) => c.volume);
  const avgVolume = recentVolumes.reduce((a, b) => a + b, 0) / (recentVolumes.length || 1);
  if (latest.volume > avgVolume * 1.2) volumeScore = 80;
  else if (latest.volume > avgVolume) volumeScore = 68;
  else volumeScore = 45;

  // Composite weighted score
  const composite = Math.round(
    trendScore * 0.35 +
    momentumScore * 0.35 +
    volatilityScore * 0.15 +
    volumeScore * 0.15
  );

  let signal = 'Neutral';
  if (composite >= 70) signal = 'Bullish';
  else if (composite >= 60) signal = 'Moderate Bullish';
  else if (composite <= 40) signal = 'Bearish';
  else if (composite <= 48) signal = 'Moderate Bearish';

  return {
    technicalScore: composite,
    signal,
    components: {
      momentum: Math.round(momentumScore),
      trend: Math.round(trendScore),
      volatility: Math.round(volatilityScore),
      volume: Math.round(volumeScore)
    }
  };
}

/**
 * Computes all indicators and attaches them to the historical candle series
 */
function computeIndicators(candles) {
  if (!candles || candles.length === 0) return { candles: [], latest: {} };

  const sma20 = calculateSMA(candles, 20);
  const sma50 = calculateSMA(candles, 50);
  const sma200 = calculateSMA(candles, 200);
  const ema20 = calculateEMA(candles, 20);
  const ema50 = calculateEMA(candles, 50);
  const rsi = calculateRSI(candles, 14);
  const macd = calculateMACD(candles);
  const bb = calculateBollingerBands(candles, 20, 2);

  const enrichedCandles = candles.map((c, idx) => ({
    ...c,
    sma20: sma20[idx],
    sma50: sma50[idx],
    sma200: sma200[idx],
    ema20: ema20[idx],
    ema50: ema50[idx],
    rsi: rsi[idx],
    macd: macd.macdLine[idx],
    macdSignal: macd.signalLine[idx],
    macdHist: macd.histogram[idx],
    bbUpper: bb.upper[idx],
    bbMiddle: bb.middle[idx],
    bbLower: bb.lower[idx]
  }));

  const lastIdx = enrichedCandles.length - 1;
  const latestInd = {
    sma20: sma20[lastIdx],
    sma50: sma50[lastIdx],
    sma200: sma200[lastIdx],
    ema20: ema20[lastIdx],
    ema50: ema50[lastIdx],
    rsi: rsi[lastIdx],
    macd: macd.macdLine[lastIdx],
    macdSignal: macd.signalLine[lastIdx],
    macdHist: macd.histogram[lastIdx],
    bbUpper: bb.upper[lastIdx],
    bbMiddle: bb.middle[lastIdx],
    bbLower: bb.lower[lastIdx]
  };

  const scoring = evaluateTechnicalScore(candles, latestInd);

  return {
    candles: enrichedCandles,
    latest: latestInd,
    scoring
  };
}

module.exports = {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  evaluateTechnicalScore,
  computeIndicators
};
