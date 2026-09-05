import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Search,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  ChevronDown,
  TrendingUp,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { stockService } from '../../services/stockService';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await stockService.searchStocks(searchQuery);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectStock = (symbol) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/stock/${symbol}`);
  };

  return (
    <header className="border-b border-gray-800/80 bg-[#111827]/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white leading-none">
                Stock<span className="text-indigo-400">Sense</span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-wider uppercase font-semibold mt-0.5">
                Market Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Global Live Stock Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowDropdown(true)}
              placeholder="Search ticker (e.g. TCS, INFY, AAPL, RELIANCE)..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-gray-900/90 border border-gray-700/80 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowDropdown(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-xs text-gray-400 text-center animate-pulse">
                  Searching market database...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-1">
                  {searchResults.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => handleSelectStock(stock.symbol)}
                      className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-800/80 text-left transition group border-b border-gray-800/40 last:border-b-0"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white group-hover:text-indigo-400 transition">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                            {stock.exchange || 'NSE'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate max-w-xs">{stock.companyName}</p>
                      </div>
                      <TrendingUp className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-xs text-gray-400 text-center">
                  No stocks matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center space-x-3">
          {/* Market Status indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Market Online
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 flex items-center justify-center transition"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile / Auth State */}
          {isAuthenticated ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-medium text-gray-200 hidden sm:inline-block max-w-[100px] truncate">
                  {user?.name || 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-1 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-gray-800">
                    <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/watchlist"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    My Watchlist
                  </Link>
                  <Link
                    to="/portfolio"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Portfolio Tracker
                  </Link>
                  <Link
                    to="/alerts"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Alerts & Triggers
                  </Link>

                  <div className="border-t border-gray-800 my-1"></div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm shadow-indigo-500/20"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
