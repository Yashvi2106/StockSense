import React, { useEffect, useState } from 'react';
import { Bookmark, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { userDataService } from '../services/userDataService';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const WatchlistPage = () => {
  const [items, setItems] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [error, setError] = useState('');
  const load = async () => { try { setItems(await userDataService.getWatchlist()); } catch (err) { setError('Unable to load your watchlist.'); } };
  useEffect(() => { load(); }, []);
  const add = async (event) => { event.preventDefault(); if (!symbol.trim()) return; try { await userDataService.addWatchlist({ symbol: symbol.trim() }); setSymbol(''); load(); } catch (err) { setError('Unable to add that symbol.'); } };
  const remove = async (value) => { await userDataService.removeWatchlist(value); setItems(items.filter((item) => item.symbol !== value)); };
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
        <form onSubmit={add} className="flex gap-2"><input value={symbol} onChange={(event) => setSymbol(event.target.value)} placeholder="Ticker" className="w-24 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white" /><button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"><Plus className="w-3.5 h-3.5" />Add</button></form>
      </div>

      {error && <p className="text-xs text-rose-400">{error}</p>}

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
            {items.map((item) => <tr key={item._id} className="hover:bg-gray-800/40 transition"><td className="py-3.5 font-bold text-white"><Link to={`/stock/${item.symbol}`} className="hover:text-indigo-400">{item.symbol}</Link></td><td className="py-3.5 text-gray-300">{item.companyName || item.quote?.companyName || '—'}</td><td className="py-3.5 font-semibold text-white">{item.quote ? formatCurrency(item.quote.currentPrice, item.quote.currency) : '—'}</td><td className={`py-3.5 font-semibold ${(item.quote?.changePercent || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{item.quote ? formatPercent(item.quote.changePercent) : '—'}</td><td className="py-3.5 text-right"><button onClick={() => remove(item.symbol)} title="Remove from watchlist" className="text-gray-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button></td></tr>)}
          </tbody>
        </table>
        {!items.length && <p className="py-8 text-center text-xs text-gray-500">Your watchlist is empty.</p>}
      </div>
    </div>
  );
};
