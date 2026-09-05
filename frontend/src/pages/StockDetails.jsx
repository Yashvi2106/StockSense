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
  AlertTriangle
} from 'lucide-react';
import { stockService } from '../services/stockService';
import { MetricCard } from '../components/common/MetricCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { formatCurrency, formatPercent, formatCompact } from '../utils/formatters';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const fetchStock = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await stockService.getQuote(symbol);
      setStock(data);
    } catch (err) {
      console.error('Failed to load stock quote:', err);
      setError(`Unable to retrieve market quote for ${symbol}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [symbol]);

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
          <button
            onClick={() => setIsWatchlisted(!isWatchlisted)}
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
            <span className="text-[11px] text-gray-400 font-normal ml-1">Today</span>
          </div>
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

          {/* AI Synthesis Summary Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-900 via-indigo-950/20 to-gray-900 border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">StockSense Intelligence Synthesis</h3>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full ml-auto">
                Signal: Bullish
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {stock.symbol} is displaying steady technical strength, backed by consistent trading volume. Moving average convergence signals positive continuation, while recent news flow skews favorable.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-800/80">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Positive Contributing Factors
                </h4>
                <ul className="text-xs text-gray-300 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Price currently trades above 50-day moving average
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Positive enterprise news sentiment score (0.78)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Elevated volume accumulation
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  Risk & Warning Factors
                </h4>
                <ul className="text-xs text-gray-300 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Annualized 30-day volatility above peer median
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Sensitivity to global IT sector spending delays
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'overview' && (
        <div className="p-8 rounded-2xl bg-gray-900/40 border border-gray-800 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-950/60 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white capitalize">{activeTab} Module</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
            This module is being built in the upcoming development phase and will be seamlessly wired here.
          </p>
        </div>
      )}
    </div>
  );
};
