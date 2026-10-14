import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-gray-800/80 bg-[#111827]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Stock<span className="text-indigo-400">Sense</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-500/20"
              >
                Go to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-semibold text-gray-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-500/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-gray-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-xs text-indigo-300 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Powered Stock Intelligence & Market Analytics</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Understand <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">Why</span> Stocks Behave The Way They Do.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Move beyond simple price quotes. StockSense synthesizes real-time market data, algorithmic technical indicators, financial news sentiment NLP, machine learning return forecasting, and institutional risk metrics into explainable intelligence.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-xl shadow-indigo-500/25"
            >
              Launch StockSense Analytics
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/stock/TCS"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-200 transition"
            >
              Explore Sample Stock (TCS)
            </Link>
          </div>
        </div>

        {/* Live Intelligence Card Preview Example from Section 2 */}
        <div className="max-w-4xl mx-auto px-4 mt-16">
          <div className="rounded-2xl bg-[#0F172A] border border-indigo-500/30 shadow-2xl p-6 sm:p-8 backdrop-blur relative">
            <div className="absolute top-4 right-4 text-[11px] font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
              Live Multi-Factor Synthesis
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-800 gap-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Spotlight Ticker</span>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  TCS <span className="text-sm font-normal text-gray-400">Tata Consultancy Services Ltd</span>
                </h3>
              </div>
              <div className="sm:text-right">
                <div className="text-3xl font-extrabold text-white">Latest provider data</div>
                <div className="text-xs font-semibold text-emerald-400 flex sm:justify-end items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Quotes load after selecting a stock
                </div>
              </div>
            </div>

            {/* Metric Score Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-gray-800 text-center">
              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                <div className="text-xs text-gray-400 font-medium">Technical Score</div>
                <div className="text-xl font-bold text-indigo-400 mt-1">78 / 100</div>
                <div className="text-[10px] text-emerald-400 font-medium mt-0.5">Bullish Trend</div>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                <div className="text-xs text-gray-400 font-medium">Sentiment Score</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">71 / 100</div>
                <div className="text-[10px] text-emerald-400 font-medium mt-0.5">Positive News Flow</div>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                <div className="text-xs text-gray-400 font-medium">Risk Score</div>
                <div className="text-xl font-bold text-amber-400 mt-1">42 / 100</div>
                <div className="text-[10px] text-amber-400 font-medium mt-0.5">Moderate Risk</div>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                <div className="text-xs text-gray-400 font-medium">ML Confidence</div>
                <div className="text-xl font-bold text-purple-400 mt-1">73%</div>
                <div className="text-[10px] text-purple-400 font-medium mt-0.5">XGBoost Forecast</div>
              </div>
            </div>

            {/* Explanation Factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Positive Catalyst Factors
                </h4>
                <ul className="text-xs text-gray-300 space-y-1.5 pl-1">
                  <li className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Recent news sentiment +78% on enterprise AI transformation deals
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Strong momentum: price sustained comfortably above SMA50 and EMA20
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Volume expansion 1.25x relative to 20-day historical average
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Risk & Warning Factors
                </h4>
                <ul className="text-xs text-gray-300 space-y-1.5 pl-1">
                  <li className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Short-term annualized volatility elevated at 22.4%
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    RSI approaching overbought boundary (66.5)
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Global tech sector interest-rate sensitivity
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technology Modules */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white">Full-Stack Intelligence Architecture</h2>
          <p className="mt-3 text-sm text-gray-400">
            A segregated multi-service system ensuring real-time responsive analytics backed by dedicated quantitative machine learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">Algorithmic Technical Scoring</h3>
            <p className="mt-2 text-xs text-gray-400 leading-relaxed">
              Mathematical calculation of SMA (20, 50, 200), EMA, RSI(14), MACD histogram, and Bollinger Bands with composite scoring across momentum, trend, and volume.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center mb-4">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">Machine Learning Return Models</h3>
            <p className="mt-2 text-xs text-gray-400 leading-relaxed">
              XGBoost and Random Forest models trained on non-stationary future returns with lag features and time-series chronological validation (no lookahead bias).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">Institutional Risk Metrics</h3>
            <p className="mt-2 text-xs text-gray-400 leading-relaxed">
              Parametric Value at Risk (VaR 95%), Sharpe ratio, Beta against benchmark indices, and maximum historical drawdown calculations.
            </p>
          </div>
        </div>
      </section>

      {/* Educational Platform Disclaimer */}
      <section className="bg-gray-900/80 border-y border-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4" />
            Educational & Research Notice
          </div>
          <h3 className="text-xl font-bold text-white">Important Financial Disclaimer</h3>
          <p className="mt-3 text-xs text-gray-400 leading-relaxed">
            StockSense is created strictly as an educational platform and research tool. It does NOT provide guaranteed financial forecasts, investment recommendations, or live brokerage trade execution. Past performance and algorithmic backtests do not guarantee future market results. Always conduct independent research before making investment decisions.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-xs text-gray-500">
        <p>StockSense &copy; 2026. AI-Powered Stock Intelligence Platform.</p>
      </footer>
    </div>
  );
};
