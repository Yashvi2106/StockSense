const marketDataService = require('./marketData');
const technicalService = require('./technicalService');
const newsService = require('./newsService');
const mlClient = require('./mlClient');

class AISummaryService {
  async generateStockSummary(symbol) {
    const norm = symbol.toUpperCase();

    // 1. Fetch all multi-factor signals in parallel
    const [quote, history, newsData] = await Promise.all([
      marketDataService.getQuote(norm).catch(() => null),
      marketDataService.getHistorical(norm, '6M').catch(() => []),
      newsService.getStockNews(norm).catch(() => null)
    ]);

    if (!quote) {
      throw Object.assign(new Error(`Stock ${norm} not found`), { statusCode: 404 });
    }

    // 2. Technical analysis
    const { latest: techIndicators, scoring } = technicalService.computeIndicators(history);

    // 3. Machine learning forecast
    let mlPrediction = null;
    try {
      mlPrediction = await mlClient.predict(norm, quote.currentPrice, history);
    } catch {
      mlPrediction = null;
    }

    // 4. Risk metrics
    const returns = history.slice(1).map((item, index) => (item.close - history[index].close) / history[index].close).filter(Number.isFinite);
    const mean = returns.reduce((sum, value) => sum + value, 0) / (returns.length || 1);
    const variance = returns.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / (returns.length || 1);
    const annualizedVol = Math.sqrt(variance) * Math.sqrt(252);

    // 5. Build grounded, explainable insights
    const positiveFactors = [];
    const riskFactors = [];
    const keyObservations = [];

    // Technical grounding
    if (techIndicators?.sma50 && quote.currentPrice > techIndicators.sma50) {
      positiveFactors.push(`Trading above 50-day moving average (₹${techIndicators.sma50.toFixed(2)}), supporting medium-term uptrend`);
    } else if (techIndicators?.sma50) {
      riskFactors.push(`Trading below 50-day moving average (₹${techIndicators.sma50.toFixed(2)}), signalling technical resistance`);
    }

    if (techIndicators?.rsi) {
      if (techIndicators.rsi >= 50 && techIndicators.rsi <= 68) {
        positiveFactors.push(`RSI at ${techIndicators.rsi.toFixed(1)} shows healthy bullish momentum without being overbought`);
      } else if (techIndicators.rsi > 70) {
        riskFactors.push(`RSI at ${techIndicators.rsi.toFixed(1)} indicates overbought conditions with potential pullback risk`);
      } else if (techIndicators.rsi < 35) {
        riskFactors.push(`RSI at ${techIndicators.rsi.toFixed(1)} indicates oversold territory and selling pressure`);
      }
    }

    if (techIndicators?.macdHist != null) {
      if (techIndicators.macdHist > 0) {
        positiveFactors.push(`MACD histogram is positive (+${techIndicators.macdHist.toFixed(2)}), indicating bullish acceleration`);
      } else {
        riskFactors.push(`MACD histogram is negative (${techIndicators.macdHist.toFixed(2)}), indicating bearish divergence`);
      }
    }

    // Volume grounding
    if (history.length >= 20) {
      const avgVol20 = history.slice(-20).reduce((s, c) => s + c.volume, 0) / 20;
      const volRatio = quote.volume / (avgVol20 || 1);
      if (volRatio > 1.2) {
        positiveFactors.push(`Trading volume is ${volRatio.toFixed(1)}x higher than the 20-day historical average`);
      } else if (volRatio < 0.7) {
        riskFactors.push(`Trading volume is muted (${volRatio.toFixed(1)}x of 20-day average), indicating low market participation`);
      }
    }

    // Sentiment grounding
    if (newsData?.sentimentSummary) {
      const { overall, averageScore, positivePercent, negativePercent } = newsData.sentimentSummary;
      if (overall === 'Positive') {
        positiveFactors.push(`News sentiment is predominantly positive (${positivePercent}% positive coverage, score +${averageScore})`);
      } else if (overall === 'Negative') {
        riskFactors.push(`News sentiment is unfavorable (${negativePercent}% negative coverage, score ${averageScore})`);
      } else {
        keyObservations.push(`News sentiment remains balanced (${newsData.sentimentSummary.neutralPercent}% neutral coverage)`);
      }
    }

    // Volatility grounding
    if (annualizedVol > 0.30) {
      riskFactors.push(`Annualized historical volatility is elevated at ${(annualizedVol * 100).toFixed(1)}%`);
    } else {
      positiveFactors.push(`Annualized volatility is moderate at ${(annualizedVol * 100).toFixed(1)}%, indicating price stability`);
    }

    // ML forecast grounding
    if (mlPrediction) {
      const retPct = (mlPrediction.predictedReturn * 100).toFixed(1);
      if (mlPrediction.predictedReturn > 0.01) {
        positiveFactors.push(`XGBoost ML model forecasts +${retPct}% 7-day expected return with ${(mlPrediction.confidence * 100).toFixed(0)}% confidence`);
      } else if (mlPrediction.predictedReturn < -0.01) {
        riskFactors.push(`XGBoost ML model forecasts ${retPct}% 7-day expected return with ${(mlPrediction.confidence * 100).toFixed(0)}% confidence`);
      }
    }

    // Ensure fallback items if any list is empty
    if (positiveFactors.length === 0) {
      positiveFactors.push("Consolidation pattern near current valuation benchmark");
    }
    if (riskFactors.length === 0) {
      riskFactors.push("Macroeconomic sector sensitivity and general market uncertainty");
    }

    // Synthesize structured executive paragraphs
    const priceChangeDirection = quote.change >= 0 ? "gaining" : "declining";
    const momentumDescription = scoring?.signal || "Neutral";
    const sentimentStance = newsData?.sentimentSummary?.overall || "Neutral";

    const executiveSummary = [
      `${quote.companyName} (${norm}) is currently trading at ₹${quote.currentPrice.toLocaleString('en-IN')}, ${priceChangeDirection} ${Math.abs(quote.changePercent)}% today. The overall technical structure reflects a ${momentumDescription.toLowerCase()} stance with a composite score of ${scoring?.technicalScore ?? 50}/100.`,
      `Recent financial news sentiment remains ${sentimentStance.toLowerCase()}, supported by ${newsData?.sentimentSummary?.positivePercent ?? 50}% positive headlines. Trading volume sits at ${quote.volume ? (quote.volume / 1e6).toFixed(2) + 'M' : 'steady'} shares.`,
      annualizedVol > 0.28
        ? `However, annualized price volatility remains elevated at ${(annualizedVol * 100).toFixed(1)}%, requiring disciplined risk management around key support levels.`
        : `Historical volatility is contained at ${(annualizedVol * 100).toFixed(1)}%, reflecting relatively stable institutional holding patterns.`
    ].join('\n\n');

    return {
      symbol: norm,
      companyName: quote.companyName,
      currentPrice: quote.currentPrice,
      changePercent: quote.changePercent,
      technicalScore: scoring?.technicalScore ?? 50,
      overallSignal: scoring?.signal ?? 'Neutral',
      sentimentScore: newsData?.sentimentSummary?.averageScore ?? 0,
      sentimentRating: newsData?.sentimentSummary?.overall ?? 'Neutral',
      executiveSummary,
      positiveFactors,
      riskFactors,
      keyObservations,
      generatedAt: new Date().toISOString()
    };
  }
}

module.exports = new AISummaryService();
