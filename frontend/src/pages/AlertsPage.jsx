import React from 'react';
import { Bell, Plus, CheckCircle, AlertCircle } from 'lucide-react';

export const AlertsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" />
            Price & Indicator Alerts
          </h1>
          <p className="text-xs text-gray-400 mt-1">Set in-app triggers for price targets, breakouts, and RSI boundaries.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition">
          <Plus className="w-3.5 h-3.5" />
          Create Alert
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-3">
        <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-xs">
              TCS
            </div>
            <div>
              <div className="text-xs font-bold text-white">TCS &gt; ₹3,500.00</div>
              <p className="text-[11px] text-gray-400">Trigger on upward resistance breakout</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
            Active
          </span>
        </div>

        <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center font-bold text-xs">
              INFY
            </div>
            <div>
              <div className="text-xs font-bold text-white">INFY RSI &lt; 30</div>
              <p className="text-[11px] text-gray-400">Oversold rebound monitor</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};
