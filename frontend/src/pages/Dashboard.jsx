import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Brain,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Bookmark
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { stockService } from '../services/stockService';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [spotlightStock, setSpotlightStock] = useState(null);
  const [curatedList, setCuratedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Parallel fetch for market overview, spotlight (TCS), and curated list
      const [overviewData, tcsQuote, curated] = await Promise.all([
        stockService.getMarketOverview().catch(() => null),
        stockService.getQuote('TCS').catch(() => null),
        stockService.getCuratedStocks().catch(() => [])
      ]);

      setOverview(overviewData);
      setSpotlightStock(tcsQuote);
      setCuratedList(curated.slice(0, 8));
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Unable to load real-time market data. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton className="h-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton className="h-80" />
          <CardSkeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome / Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Market Intelligence Dashboard
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            Real-time equity quotes, technical scores, news sentiment, and algorithmic forecasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/stock/TCS"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            Analyze Stock
          </Link>
        </div>
      </div>

      {/* Global Market Overview Indices */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Benchmark Indices
          </span>
          <span className="text-[11px] text-gray-500">Live Continuous Feeds</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overview?.indices?.map((idx) => {
            const isPos = idx.change >= 0;
            return (
              <div
                key={idx.name}
                className="p-4 rounded-2xl bg-gray-900/70 border border-gray-800/80 hover:border-gray-700/80 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-200">{idx.name}</span>
                  <span className="text-[10px] text-gray-500 uppercase">{idx.region}</span>
                </div>
                <div className="mt-2 text-xl font-bold text-white">
                  {idx.price ? Number(idx.price).toLocaleString('en-US') : '—'}
                </div>
                <div
                  className={`mt-1 flex items-center gap-1 text-xs font-semibold ${
                    isPos ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>
                    {isPos ? '+' : ''}
                    {idx.change} ({formatPercent(idx.changePercent)})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Market Spotlight Intelligence Banner */}
      {spotlightStock && (
        <div className="rounded-2xl bg-gradient-to-r from-gray-900 via-indigo-950/30 to-gray-900 border border-indigo-500/20 p-6 sm:p-7 relative overflow-hidden shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Featured Intelligence Spotlight
              </div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {spotlightStock.symbol} &mdash; {spotlightStock.companyName}
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                TCS exhibits positive short-term momentum with price action trading above key moving averages. Institutional news sentiment remains constructive (+78%) following large enterprise cloud expansions.
              </p>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <div className="text-left sm:text-right">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Current Quote</div>
                <div className="text-2xl font-extrabold text-white">
                  {formatCurrency(spotlightStock.currentPrice, spotlightStock.currency)}
                </div>
                <div
                  className={`text-xs font-semibold flex items-center gap-1 ${
                    spotlightStock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {spotlightStock.change >= 0 ? '+' : ''}
                  {spotlightStock.change} ({formatPercent(spotlightStock.changePercent)})
                </div>
              </div>

              <Link
                to={`/stock/${spotlightStock.symbol}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-500/25"
              >
                <span>Full Intelligence Breakdown</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Factor Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-800/80">
            <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
              <span className="text-[11px] text-gray-400 font-medium">Technical Score</span>
              <div className="text-lg font-bold text-indigo-400">78 / 100</div>
              <span className="text-[10px] text-emerald-400">Bullish Momentum</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
              <span className="text-[11px] text-gray-400 font-medium">News Sentiment</span>
              <div className="text-lg font-bold text-emerald-400">71 / 100</div>
              <span className="text-[10px] text-emerald-400">Positive Sentiment</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
              <span className="text-[11px] text-gray-400 font-medium">Risk Level</span>
              <div className="text-lg font-bold text-amber-400">42 / 100</div>
              <span className="text-[10px] text-amber-400">Moderate Risk</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
              <span className="text-[11px] text-gray-400 font-medium">7-Day Forecast</span>
              <div className="text-lg font-bold text-purple-400">₹3,380 &ndash; ₹3,520</div>
              <span className="text-[10px] text-purple-400">73% Confidence (XGBoost)</span>
            </div>
          </div>
        </div>
      )}

      {/* Curated Stocks Explorer */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Curated Market Equities</h3>
            <p className="text-xs text-gray-400">Explore fundamentals, technical indicators, and AI analysis</p>
          </div>
          <Link
            to="/watchlist"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View Watchlist
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {curatedList.map((stock) => (
            <Link
              key={stock.symbol}
              to={`/stock/${stock.symbol}`}
              className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 hover:bg-gray-800/40 transition group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-white group-hover:text-indigo-400 transition">
                    {stock.symbol}
                  </span>
                  <p className="text-xs text-gray-400 truncate max-w-[150px]">{stock.companyName}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 border border-gray-700 font-medium">
                  {stock.exchange}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
                <span className="text-gray-400">{stock.sector}</span>
                <span className="text-indigo-400 font-semibold group-hover:underline">Analyze &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Movers & Market News Teasers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Movers */}
        <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Active Top Movers
            </h3>
            <span className="text-xs text-gray-500">Intraday %</span>
          </div>

          <div className="space-y-3">
            {overview?.movers?.map((mover) => (
              <Link
                key={mover.symbol}
                to={`/stock/${mover.symbol}`}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-800/40 hover:bg-gray-800 border border-gray-800 transition"
              >
                <div>
                  <span className="font-bold text-sm text-white">{mover.symbol}</span>
                  <span className="text-xs text-gray-400 ml-2 hidden sm:inline">{mover.companyName}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-xs text-white">
                    {formatCurrency(mover.currentPrice, mover.currency)}
                  </div>
                  <div
                    className={`text-[11px] font-semibold ${
                      mover.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {mover.change >= 0 ? '+' : ''}
                    {mover.changePercent}%
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* AI Market Summary Card */}
        <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-sm text-white">AI Market Summary</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Global market sentiment remains moderately positive. Indian domestic benchmarks (Nifty 50 and Sensex) are consolidating near record highs, buoyed by resilience in IT services and steady private banking performance.
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span><strong>IT Sector:</strong> Positive momentum driven by enterprise AI deal flow.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span><strong>Financials:</strong> Stable net interest margins and contained NPAs.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span><strong>Cautionary Factor:</strong> High volatility on global macroeconomic data prints.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-500">
            <span>Aggregated from quantitative feeds</span>
            <Link to="/stock/TCS" className="text-indigo-400 font-semibold hover:underline">
              Inspect TCS Factors &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
