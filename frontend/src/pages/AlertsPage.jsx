import React, { useEffect, useState } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { userDataService } from '../services/userDataService';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({ symbol: '', condition: 'PRICE_ABOVE', targetValue: '' });
  const load = async () => { try { setAlerts(await userDataService.getAlerts()); } catch (err) { setAlerts([]); } };
  useEffect(() => { load(); }, []);
  const create = async (event) => { event.preventDefault(); if (!form.symbol || !form.targetValue) return; await userDataService.addAlert({ ...form, targetValue: Number(form.targetValue) }); setForm({ symbol: '', condition: 'PRICE_ABOVE', targetValue: '' }); load(); };
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
        <button onClick={() => document.getElementById('alert-form').scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition">
          <Plus className="w-3.5 h-3.5" />
          Create Alert
        </button>
      </div>

      <form id="alert-form" onSubmit={create} className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-wrap gap-2"><input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} placeholder="Symbol" className="w-24 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white" /><select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"><option value="PRICE_ABOVE">Price above</option><option value="PRICE_BELOW">Price below</option><option value="RSI_ABOVE">RSI above</option><option value="RSI_BELOW">RSI below</option></select><input type="number" step="any" value={form.targetValue} onChange={(e) => setForm({ ...form, targetValue: e.target.value })} placeholder="Target" className="w-24 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white" /><button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white"><Plus className="w-3.5 h-3.5" />Save alert</button></form>

      <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-3">
        {alerts.map((alert) => <div key={alert._id} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-xs">
              TCS
            </div>
            <div>
              <div className="text-xs font-bold text-white">{alert.symbol} {alert.condition.replace('_', ' ').toLowerCase()} {alert.targetValue}</div>
              <p className="text-[11px] text-gray-400">{alert.isTriggered ? 'Triggered' : 'Active monitor'}</p>
            </div>
          </div>
          <button onClick={() => userDataService.removeAlert(alert._id).then(load)} className="ml-3 text-gray-400 hover:text-rose-400" title="Delete alert"><Trash2 className="w-4 h-4" /></button>
        </div>)}
        {!alerts.length && <p className="py-8 text-center text-xs text-gray-500">No alerts configured.</p>}
      </div>
    </div>
  );
};
