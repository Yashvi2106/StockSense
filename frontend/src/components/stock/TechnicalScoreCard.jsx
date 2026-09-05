import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, HelpCircle } from 'lucide-react';

export const TechnicalScoreCard = ({ scoring, indicators }) => {
  if (!scoring) return null;

  const { technicalScore, signal, components } = scoring;

  const getSignalBadge = (sig) => {
    if (sig?.includes('Bullish')) {
      return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60';
    }
    if (sig?.includes('Bearish')) {
      return 'bg-rose-950/60 text-rose-400 border-rose-800/60';
    }
    return 'bg-gray-800 text-gray-300 border-gray-700';
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 55) return 'text-indigo-400';
    if (score >= 45) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getProgressColor = (score) => {
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 55) return 'bg-indigo-500';
    if (score >= 45) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-800">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Quantitative Technical Score
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Algorithmic composite of moving averages, oscillators, and volume
          </p>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getSignalBadge(signal)}`}>
          Signal: {signal}
        </span>
      </div>

      {/* Main Score Dial / Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center p-6 rounded-2xl bg-gray-800/40 border border-gray-800">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Overall Rating</span>
          <div className={`text-5xl font-black tracking-tight mt-2 ${getScoreColor(technicalScore)}`}>
            {technicalScore}
            <span className="text-xl text-gray-500 font-medium"> / 100</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Weighted synthesis across 4 technical dimensions
          </p>
        </div>

        {/* Dimension Sub-Scores */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300">Trend Strength (SMA & EMA)</span>
              <span className="text-white">{components?.trend || 50} / 100</span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(components?.trend || 50)}`}
                style={{ width: `${components?.trend || 50}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300">Momentum (RSI & MACD)</span>
              <span className="text-white">{components?.momentum || 50} / 100</span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(components?.momentum || 50)}`}
                style={{ width: `${components?.momentum || 50}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300">Volatility Health (Bollinger Bands)</span>
              <span className="text-white">{components?.volatility || 50} / 100</span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(components?.volatility || 50)}`}
                style={{ width: `${components?.volatility || 50}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300">Volume Confirmation</span>
              <span className="text-white">{components?.volume || 50} / 100</span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(components?.volume || 50)}`}
                style={{ width: `${components?.volume || 50}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Notice */}
      <div className="p-3.5 rounded-xl bg-gray-800/40 border border-gray-800 flex items-start gap-2.5 text-[11px] text-gray-400">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Disclaimer:</strong> Technical scores represent statistical aggregations of historical price and volume data. They are not financial recommendations or guaranteed trading signals.
        </span>
      </div>
    </div>
  );
};
