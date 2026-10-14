import React, { useEffect, useState } from 'react';
import { Briefcase, AlertTriangle } from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { userDataService } from '../services/userDataService';

export const PortfolioPage = () => {
  const [data, setData] = useState({ holdings: [], totals: {} });
  useEffect(() => { userDataService.getPortfolio().then(setData).catch(() => {}); }, []);
  const totals = data.totals || {};
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
        <MetricCard title="Total Invested" value={`₹${(totals.investedValue || 0).toFixed(2)}`} subtitle="Initial Capital" />
        <MetricCard title="Current Value" value={`₹${(totals.currentValue || 0).toFixed(2)}`} change={totals.pnl} changePercent={totals.pnlPercent} subtitle="Market Valuation" />
        <MetricCard title="Total P&L" value={`₹${(totals.pnl || 0).toFixed(2)}`} change={totals.pnl} subtitle="Unrealized Gains" />
        <MetricCard title="Active Holdings" value={`${data.holdings?.length || 0} Stocks`} subtitle="Tracked positions" />
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
            {data.holdings?.map((holding) => <tr key={holding._id} className="hover:bg-gray-800/40 transition"><td className="py-3.5 font-bold text-white">{holding.symbol}</td><td className="py-3.5 text-gray-300">{holding.quantity}</td><td className="py-3.5 text-gray-300">₹{holding.averageBuyPrice.toFixed(2)}</td><td className="py-3.5 text-gray-300">₹{holding.currentPrice.toFixed(2)}</td><td className="py-3.5 font-semibold text-white">₹{holding.currentValue.toFixed(2)}</td><td className={`py-3.5 font-semibold ${holding.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>₹{holding.pnl.toFixed(2)} ({holding.pnlPercent.toFixed(2)}%)</td></tr>)}
          </tbody>
        </table>
        {!data.holdings?.length && <p className="py-8 text-center text-xs text-gray-500">No holdings in your portfolio.</p>}
      </div>
    </div>
  );
};
