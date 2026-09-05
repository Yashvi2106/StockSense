import React from 'react';
import { Briefcase, Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';

export const PortfolioPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            Portfolio Tracker
          </h1>
          <p className="text-xs text-gray-400 mt-1">Simulated portfolio performance and risk analytics.</p>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Tracking only. No real trading execution.</span>
        </div>
      </div>

      {/* Portfolio Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Invested" value="₹64,000.00" subtitle="Initial Capital" />
        <MetricCard title="Current Value" value="₹68,430.00" change={4430} changePercent={6.92} subtitle="Market Valuation" />
        <MetricCard title="Total P&L" value="+₹4,430.00" change={4430} subtitle="Unrealized Gains" />
        <MetricCard title="Active Holdings" value="2 Stocks" subtitle="NSE Large Cap" />
      </div>

      {/* Holdings Table */}
      <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-white">Current Simulated Holdings</h3>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
              <th className="pb-3 font-semibold">Asset</th>
              <th className="pb-3 font-semibold">Quantity</th>
              <th className="pb-3 font-semibold">Avg Buy Price</th>
              <th className="pb-3 font-semibold">Current Price</th>
              <th className="pb-3 font-semibold">Current Value</th>
              <th className="pb-3 font-semibold">P&L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            <tr className="hover:bg-gray-800/40 transition">
              <td className="py-3.5 font-bold text-white">TCS</td>
              <td className="py-3.5 text-gray-300">10 shares</td>
              <td className="py-3.5 text-gray-300">₹3,200.00</td>
              <td className="py-3.5 text-gray-300">₹3,421.50</td>
              <td className="py-3.5 font-semibold text-white">₹34,215.00</td>
              <td className="py-3.5 font-semibold text-emerald-400">+₹2,215.00 (+6.92%)</td>
            </tr>
            <tr className="hover:bg-gray-800/40 transition">
              <td className="py-3.5 font-bold text-white">INFY</td>
              <td className="py-3.5 text-gray-300">20 shares</td>
              <td className="py-3.5 text-gray-300">₹1,600.00</td>
              <td className="py-3.5 text-gray-300">₹1,845.20</td>
              <td className="py-3.5 font-semibold text-white">₹36,904.00</td>
              <td className="py-3.5 font-semibold text-emerald-400">+₹4,904.00 (+15.3%)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
