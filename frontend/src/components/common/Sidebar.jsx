import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Bookmark,
  Briefcase,
  SlidersHorizontal,
  Bell,
  Info,
  ExternalLink
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Stock Intelligence', path: '/stock/TCS', icon: Search },
  { name: 'Watchlist', path: '/watchlist', icon: Bookmark },
  { name: 'Portfolio Tracker', path: '/portfolio', icon: Briefcase },
  { name: 'Backtesting', path: '/backtest', icon: SlidersHorizontal },
  { name: 'Price & RSI Alerts', path: '/alerts', icon: Bell }
];

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-gray-800/80 bg-[#0E1320] flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-4rem)] hidden md:flex">
      {/* Nav Links */}
      <div className="p-4 space-y-1">
        <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Analytics Hub
        </p>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Educational Disclaimer Widget */}
      <div className="p-4 border-t border-gray-800/80">
        <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5 font-semibold text-gray-300 mb-1">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Educational Platform</span>
          </div>
          <p className="leading-relaxed text-gray-400">
            For market analytics, risk analysis, and educational modeling only. Does NOT execute real trades.
          </p>
        </div>
      </div>
    </aside>
  );
};
