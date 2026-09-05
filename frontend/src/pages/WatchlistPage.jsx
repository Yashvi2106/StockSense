import React from 'react';
import { Bookmark, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WatchlistPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-400" />
            My Watchlist
          </h1>
          <p className="text-xs text-gray-400 mt-1">Track key stocks, technical signals, and sentiment scores.</p>
        </div>
        <Link
          to="/stock/TCS"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Find Stocks
        </Link>
      </div>

      <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
              <th className="pb-3 font-semibold">Symbol</th>
              <th className="pb-3 font-semibold">Company Name</th>
              <th className="pb-3 font-semibold">Price</th>
              <th className="pb-3 font-semibold">24h Change</th>
              <th className="pb-3 font-semibold">Signal</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            <tr className="hover:bg-gray-800/40 transition">
              <td className="py-3.5 font-bold text-white">
                <Link to="/stock/TCS" className="hover:text-indigo-400">TCS</Link>
              </td>
              <td className="py-3.5 text-gray-300">Tata Consultancy Services Ltd</td>
              <td className="py-3.5 font-semibold text-white">₹3,421.50</td>
              <td className="py-3.5 font-semibold text-emerald-400">+1.55%</td>
              <td className="py-3.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                  Bullish
                </span>
              </td>
              <td className="py-3.5 text-right">
                <Link to="/stock/TCS" className="text-indigo-400 hover:underline font-semibold">
                  Analyze &rarr;
                </Link>
              </td>
            </tr>
            <tr className="hover:bg-gray-800/40 transition">
              <td className="py-3.5 font-bold text-white">
                <Link to="/stock/INFY" className="hover:text-indigo-400">INFY</Link>
              </td>
              <td className="py-3.5 text-gray-300">Infosys Ltd</td>
              <td className="py-3.5 font-semibold text-white">₹1,845.20</td>
              <td className="py-3.5 font-semibold text-rose-400">-0.82%</td>
              <td className="py-3.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-800 text-gray-300 border border-gray-700">
                  Neutral
                </span>
              </td>
              <td className="py-3.5 text-right">
                <Link to="/stock/INFY" className="text-indigo-400 hover:underline font-semibold">
                  Analyze &rarr;
                </Link>
              </td>
            </tr>
            <tr className="hover:bg-gray-800/40 transition">
              <td className="py-3.5 font-bold text-white">
                <Link to="/stock/RELIANCE" className="hover:text-indigo-400">RELIANCE</Link>
              </td>
              <td className="py-3.5 text-gray-300">Reliance Industries Ltd</td>
              <td className="py-3.5 font-semibold text-white">₹2,980.75</td>
              <td className="py-3.5 font-semibold text-emerald-400">+1.20%</td>
              <td className="py-3.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                  Bullish
                </span>
              </td>
              <td className="py-3.5 text-right">
                <Link to="/stock/RELIANCE" className="text-indigo-400 hover:underline font-semibold">
                  Analyze &rarr;
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
