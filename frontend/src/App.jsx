import React from 'react';
import { Activity, Brain, TrendingUp, ShieldCheck, BarChart3 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-gray-800 bg-[#111827]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">Stock<span className="text-indigo-400">Sense</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 font-medium border border-indigo-700/50">AI Analytics</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/80 border border-gray-700 text-xs text-indigo-300 mb-6">
          <Brain className="w-4 h-4 text-indigo-400" />
          <span>Multi-Factor AI Stock Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl text-white">
          Understand <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Why</span> Stocks Move, Not Just Their Current Price.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl">
          Integrating real-time market action, algorithmic indicators, news sentiment NLP, machine learning return forecasting, and institutional risk metrics.
        </p>

        {/* Feature Cards Grid Preview */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition">
            <TrendingUp className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="font-semibold text-lg text-white">Technical Analytics</h3>
            <p className="mt-2 text-sm text-gray-400">SMA, EMA, RSI, MACD, and Bollinger Bands with composite technical scoring.</p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition">
            <Brain className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="font-semibold text-lg text-white">ML Return Forecasting</h3>
            <p className="mt-2 text-sm text-gray-400">Time-series XGBoost & Random Forest regression forecasting expected price bounds.</p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition">
            <BarChart3 className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="font-semibold text-lg text-white">News Sentiment NLP</h3>
            <p className="mt-2 text-sm text-gray-400">Financial sentiment analysis classifying news headlines with confidence weighting.</p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition">
            <ShieldCheck className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="font-semibold text-lg text-white">Institutional Risk</h3>
            <p className="mt-2 text-sm text-gray-400">Value at Risk (VaR 95%), Sharpe ratio, Beta, and maximum historical drawdown.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        StockSense &copy; 2026. For educational and analytical research purposes only. No trading execution or guaranteed financial advice.
      </footer>
    </div>
  );
}

export default App;
