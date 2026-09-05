import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export const IndicatorOscillators = ({ candles = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* RSI Panel */}
      <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-white">Relative Strength Index</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">RSI (14)</span>
          </div>
          <span className="text-xs font-semibold text-indigo-400">
            {candles.length ? candles[candles.length - 1].rsi ?? '—' : '—'}
          </span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={candles} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={10} tickLine={false} hide={true} />
              <YAxis domain={[0, 100]} ticks={[30, 50, 70]} stroke="#6B7280" fontSize={10} tickLine={false} orientation="right" />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }}
              />
              <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Overbought (70)', fill: '#EF4444', fontSize: 9 }} />
              <ReferenceLine y={30} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Oversold (30)', fill: '#10B981', fontSize: 9 }} />
              <Line type="monotone" dataKey="rsi" stroke="#818CF8" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MACD Panel */}
      <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-white">MACD (12, 26, 9)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">Momentum</span>
          </div>
          <span className="text-xs font-semibold text-purple-400">
            Hist: {candles.length ? candles[candles.length - 1].macdHist ?? '—' : '—'}
          </span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={candles} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={10} tickLine={false} hide={true} />
              <YAxis stroke="#6B7280" fontSize={10} tickLine={false} orientation="right" />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }}
              />
              <ReferenceLine y={0} stroke="#4B5563" />
              <Bar
                dataKey="macdHist"
                fill="#10B981"
                radius={[2, 2, 0, 0]}
              />
              <Line type="monotone" dataKey="macd" stroke="#6366F1" strokeWidth={1.5} dot={false} name="MACD" />
              <Line type="monotone" dataKey="macdSignal" stroke="#F59E0B" strokeWidth={1.5} dot={false} name="Signal" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
