import React, { useState } from 'react';
import { SlidersHorizontal, Play, BarChart3, AlertTriangle } from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { analyticsService } from '../services/analyticsService';

export const BacktestPage = () => {
  const [form, setForm] = useState({ symbol: 'TCS', strategy: 'sma_crossover', initialCapital: 100000 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const runSimulation = async () => {
    setLoading(true); setError('');
    try { setResult(await analyticsService.runBacktest(form)); } catch (err) { setError(err.response?.data?.message || 'Unable to run simulation.'); } finally { setLoading(false); }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-indigo-400" />
          Algorithmic Backtesting
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Simulate technical trading strategies over historical data with performance and drawdown metrics.
        </p>
      </div>

      {/* Configuration Box */}
      <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
        <h3 className="font-bold text-sm text-white mb-4">Strategy Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Asset</label>
            <select value={form.symbol} onChange={(event) => setForm({ ...form, symbol: event.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white">
              <option value="TCS">TCS (Tata Consultancy Services)</option>
              <option value="INFY">INFY (Infosys)</option>
              <option value="RELIANCE">RELIANCE (Reliance Industries)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Strategy</label>
            <select value={form.strategy} onChange={(event) => setForm({ ...form, strategy: event.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white">
              <option value="sma_crossover">SMA Crossover (20 / 50)</option>
              <option value="rsi_strategy">RSI (30 / 70)</option>
              <option value="buy_and_hold">Buy and Hold Benchmark</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Initial Capital</label>
            <input
              type="number"
              value={form.initialCapital}
              onChange={(event) => setForm({ ...form, initialCapital: Number(event.target.value) })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div className="flex items-end">
            <button onClick={runSimulation} disabled={loading} className="w-full py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm">
              <Play className="w-3.5 h-3.5" />
              {loading ? 'Running...' : 'Run Simulation'}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-rose-400">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard title="Initial Capital" value={`₹${(result?.initialCapital ?? form.initialCapital).toLocaleString()}`} subtitle="Starting Budget" />
        <MetricCard title="Final Capital" value={result ? `₹${result.finalCapital.toLocaleString()}` : '—'} change={result ? result.finalCapital - result.initialCapital : undefined} subtitle={result ? `${result.returnPercent}% Net Return` : 'Run a simulation'} />
        <MetricCard title="Strategy" value={result?.strategy || '—'} subtitle="Selected model" />
        <MetricCard title="Total Trades" value={result?.trades ?? '—'} subtitle="Historical execution count" />
      </div>

      <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-gray-400 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>Notice: Past backtesting performance does not guarantee future financial results.</span>
      </div>
    </div>
  );
};
