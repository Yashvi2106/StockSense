import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Brain,
  ShieldCheck,
  BarChart3,
  Bookmark,
  BookmarkCheck,
  Bell,
  SlidersHorizontal,
  Clock,
  Layers,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { stockService } from '../services/stockService';
import { MetricCard } from '../components/common/MetricCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { formatCurrency, formatPercent, formatCompact, formatMarketTimestamp } from '../utils/formatters';

import { PriceChart } from '../components/stock/PriceChart';
import { IndicatorOscillators } from '../components/stock/IndicatorOscillators';
import { TechnicalScoreCard } from '../components/stock/TechnicalScoreCard';
import { NewsFeed } from '../components/stock/NewsFeed';
import { AISummaryCard } from '../components/stock/AISummaryCard';
import { newsService } from '../services/newsService';
import { analyticsService } from '../services/analyticsService';
import { userDataService } from '../services/userDataService';

const TABS = [
  { id: 'overview', name: 'Overview' },
  { id: 'charts', name: 'Charts & Indicators' },
  { id: 'technical', name: 'Technical Score' },
  { id: 'news', name: 'News & Sentiment' },
  { id: 'prediction', name: 'ML Forecast' },
  { id: 'risk', name: 'Risk Engine' },
  { id: 'backtest', name: 'Backtesting' }
];

export const StockDetails = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [technicalData, setTechnicalData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [chartRange, setChartRange] = useState('1M');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState('');
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [risk, setRisk] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStock = async () => {
    setLoading(true);
    setError('');
    try {
      const [quoteRes, chartRes, techRes, newsRes, summaryRes] = await Promise.all([
        stockService.getQuote(symbol),
        stockService.getCharts(symbol, chartRange).catch(() => null),
        stockService.getTechnical(symbol, '6M').catch(() => null),
        newsService.getStockNews(symbol).catch(() => null),
        analyticsService.getAISummary(symbol).catch(() => null)
      ]);
      setStock(quoteRes);
      if (chartRes && chartRes.candles) setChartData(chartRes.candles);
      if (techRes) setTechnicalData(techRes);
      if (newsRes) setNewsData(newsRes);
      if (summaryRes) setAiSummary(summaryRes);
    } catch (err) {
      console.error('Failed to load stock quote:', err);
      setError(err.response?.data?.message || `Price temporarily unavailable for ${symbol}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleRangeChange = async (newRange) => {
    setChartRange(newRange);
    setChartsLoading(true);
    try {
      const res = await stockService.getCharts(symbol, newRange);
      if (res && res.candles) setChartData(res.candles);
    } catch (err) {
      console.error('Failed to update chart range:', err);
    } finally {
      setChartsLoading(false);
    }
  };

  const handleRefreshSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await analyticsService.getAISummary(symbol);
      if (res) setAiSummary(res);
    } catch (err) {
      console.error('Failed to refresh AI summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [symbol]);

  const refreshQuote = async () => {
    setRefreshing(true);
    try {
      setStock(await stockService.getQuote(symbol));
      setError('');
    } catch (err) {
      setError('Price temporarily unavailable.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!stock || stock.marketStatus !== 'OPEN') return undefined;
    const timer = window.setInterval(refreshQuote, 60 * 1000);
    return () => window.clearInterval(timer);
  }, [stock?.marketStatus, symbol]);

  useEffect(() => {
    if (activeTab === 'prediction') analyticsService.getPrediction(symbol).then(setPrediction).catch(() => setPrediction(null));
    if (activeTab === 'risk') analyticsService.getRisk(symbol).then(setRisk).catch(() => setRisk(null));
  }, [activeTab, symbol]);

  const toggleWatchlist = async () => {
    if (isWatchlisted) await userDataService.removeWatchlist(symbol);
    else await userDataService.addWatchlist({ symbol, companyName: stock.companyName, exchange: stock.exchange });
    setIsWatchlisted(!isWatchlisted);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton className="h-32" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="space-y-4">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <ErrorState title="Stock Quote Error" message={error || 'Stock not found.'} onRetry={fetchStock} />
      </div>
    );
  }

  const isPos = stock.change >= 0;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Market Overview
        </Link>

        <div className="flex items-center gap-2">
          <button onClick={refreshQuote} disabled={refreshing} title="Refresh quote" className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={toggleWatchlist}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              isWatchlisted
                ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
                : 'bg-gray-900 border-gray-800 text-gray-300 hover:text-white'
            }`}
          >
            {isWatchlisted ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Watchlisted</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Add to Watchlist</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="p-6 rounded-2xl bg-[#0E1320] border border-gray-800/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{stock.symbol}</h1>
            <span className="text-xs px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 border border-gray-700 font-medium">
              {stock.exchange || 'NSE'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-400 border border-indigo-800/50 font-medium">
              {stock.sector}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 font-medium">{stock.companyName}</p>
        </div>

        <div className="text-left md:text-right">
          <div className="text-3xl font-extrabold text-white">
            {formatCurrency(stock.currentPrice, stock.currency)}
          </div>
          <div
            className={`mt-0.5 inline-flex items-center gap-1 text-sm font-semibold ${
              isPos ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPos ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>
              {isPos ? '+' : ''}
              {stock.change} ({formatPercent(stock.changePercent)})
            </span>
            <span className="text-[11px] text-gray-400 font-normal ml-1">{stock.marketStatus === 'OPEN' ? stock.dataStatus : 'Market Closed'}</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400">Last updated: {formatMarketTimestamp(stock.timestamp || stock.lastUpdated)}</div>
          <div className="text-[11px] text-gray-500">Source: {stock.dataSource || 'Provider'} · {stock.timezone || 'Asia/Kolkata'}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800 overflow-x-auto">
        <nav className="flex space-x-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Fundamentals / Market Data Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Day High / Low"
              value={`${stock.high} / ${stock.low}`}
              subtitle={`Prev Close: ${stock.previousClose}`}
            />
            <MetricCard
              title="Trading Volume"
              value={formatCompact(stock.volume)}
              subtitle="24-Hour Shares Traded"
            />
            <MetricCard
              title="52W High / Low"
              value={`${stock.fiftyTwoWeekHigh || '—'} / ${stock.fiftyTwoWeekLow || '—'}`}
              subtitle="Yearly Price Range"
            />
            <MetricCard
              title="Market Cap"
              value={formatCompact(stock.marketCap)}
              subtitle={`P/E: ${stock.peRatio || 'N/A'}`}
            />
          </div>

          {/* Embedded Interactive Chart */}
          <PriceChart
            candles={chartData}
            range={chartRange}
            onRangeChange={handleRangeChange}
            currency={stock.currency}
          />

          {/* AI Synthesis Summary Card */}
          <AISummaryCard
            summary={aiSummary}
            loading={summaryLoading}
            onRefresh={handleRefreshSummary}
          />
        </div>
      )}

      {/* Charts & Indicators Tab */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          <PriceChart
            candles={chartData}
            range={chartRange}
            onRangeChange={handleRangeChange}
            currency={stock.currency}
          />
          <IndicatorOscillators candles={chartData} />
        </div>
      )}

      {/* Technical Score Tab */}
      {activeTab === 'technical' && (
        <div className="space-y-6">
          <TechnicalScoreCard
            scoring={technicalData?.scoring}
            indicators={technicalData?.indicators}
          />
        </div>
      )}

      {/* News & Sentiment Tab */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <NewsFeed newsData={newsData} loading={newsLoading} />
        </div>
      )}

      {activeTab === 'prediction' && (
        <div className="space-y-4"><MetricCard title="Predicted 7-day price" value={prediction ? formatCurrency(prediction.predictedPrice, stock.currency) : 'Loading...'} subtitle={prediction ? `${formatPercent(prediction.predictedReturn * 100)} expected return` : 'ML forecast'} /><div className="grid md:grid-cols-2 gap-4"><div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800"><h3 className="text-sm font-bold text-white mb-3">Supporting factors</h3>{(prediction?.importantFactors || ['Fetching model factors...']).map((factor) => <p key={factor} className="text-xs text-emerald-300 mb-2">{factor}</p>)}</div><div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800"><h3 className="text-sm font-bold text-white mb-3">Risk factors</h3>{(prediction?.riskFactors || ['Fetching model risks...']).map((factor) => <p key={factor} className="text-xs text-amber-300 mb-2">{factor}</p>)}</div></div></div>
      )}
      {activeTab === 'risk' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><MetricCard title="Annualized Volatility" value={risk ? `${(risk.volatility * 100).toFixed(2)}%` : 'Loading...'} /><MetricCard title="VaR 95%" value={risk ? `${(risk.var95 * 100).toFixed(2)}%` : '—'} /><MetricCard title="Max Drawdown" value={risk ? `${(risk.maxDrawdown * 100).toFixed(2)}%` : '—'} /><MetricCard title="Sharpe Ratio" value={risk?.sharpeRatio ?? '—'} /></div>
      )}
      {activeTab === 'backtest' && (
        <div className="p-8 rounded-2xl bg-gray-900/40 border border-gray-800 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-950/60 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Backtesting Workspace</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
            Configure and run strategies from the dedicated backtesting page.
          </p>
          <Link to="/backtest" className="inline-flex mt-4 px-3 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white">Open Backtesting</Link>
        </div>
      )}
    </div>
  );
};
