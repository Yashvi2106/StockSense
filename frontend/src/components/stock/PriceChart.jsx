import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { formatCurrency, formatCompact } from '../../utils/formatters';

const RANGES = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];

const CustomTooltip = ({ active, payload, label, currency = 'INR' }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 bg-gray-900/95 border border-gray-700 rounded-xl shadow-2xl text-xs space-y-1 backdrop-blur">
        <p className="font-semibold text-gray-300 pb-1 border-b border-gray-800">{data.date}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-400">Close:</span>
          <span className="font-bold text-white">{formatCurrency(data.close, currency)}</span>
        </div>
        {data.open != null && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400">Open:</span>
            <span className="text-gray-300">{formatCurrency(data.open, currency)}</span>
          </div>
        )}
        {data.high != null && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400">High / Low:</span>
            <span className="text-gray-300">{formatCurrency(data.high, currency)} / {formatCurrency(data.low, currency)}</span>
          </div>
        )}
        {data.volume != null && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400">Volume:</span>
            <span className="text-indigo-400 font-medium">{formatCompact(data.volume)}</span>
          </div>
        )}
        {data.sma20 != null && (
          <div className="flex items-center justify-between gap-4 text-[11px]">
            <span className="text-amber-400">SMA20:</span>
            <span className="text-amber-300">{formatCurrency(data.sma20, currency)}</span>
          </div>
        )}
        {data.sma50 != null && (
          <div className="flex items-center justify-between gap-4 text-[11px]">
            <span className="text-purple-400">SMA50:</span>
            <span className="text-purple-300">{formatCurrency(data.sma50, currency)}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const PriceChart = ({
  candles = [],
  range = '1M',
  onRangeChange,
  currency = 'INR'
}) => {
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(false);
  const [showBB, setShowBB] = useState(false);

  // Min and max for domain padding
  const prices = candles.map((c) => c.close).filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) * 0.98 : 0;
  const maxPrice = prices.length ? Math.max(...prices) * 1.02 : 100;

  return (
    <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 shadow-sm space-y-4">
      {/* Chart Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-800/80">
        {/* Overlays Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 mr-1">Overlays:</span>
          <button
            onClick={() => setShowSMA20(!showSMA20)}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition ${
              showSMA20
                ? 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
            }`}
          >
            SMA 20
          </button>
          <button
            onClick={() => setShowSMA50(!showSMA50)}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition ${
              showSMA50
                ? 'bg-purple-950/60 text-purple-400 border-purple-800/60'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
            }`}
          >
            SMA 50
          </button>
          <button
            onClick={() => setShowBB(!showBB)}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition ${
              showBB
                ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
            }`}
          >
            Bollinger Bands
          </button>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center bg-gray-800/80 p-1 rounded-xl border border-gray-700/80">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => onRangeChange && onRangeChange(r)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                range === r
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Price & Volume Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={candles} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => {
                if (!val) return '';
                const parts = val.split('-');
                return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : val;
              }}
            />

            <YAxis
              domain={[minPrice, maxPrice]}
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              orientation="right"
              tickFormatter={(v) => Number(v).toFixed(0)}
            />

            <YAxis
              yAxisId="volume"
              domain={[0, 'dataMax * 4']}
              orientation="left"
              hide={true}
            />

            <Tooltip content={<CustomTooltip currency={currency} />} />

            {/* Volume bars in background */}
            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill="#374151"
              opacity={0.35}
              radius={[2, 2, 0, 0]}
            />

            {/* Price Area */}
            <Area
              type="monotone"
              dataKey="close"
              stroke="#6366F1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />

            {/* Technical Overlays */}
            {showSMA20 && (
              <Line
                type="monotone"
                dataKey="sma20"
                stroke="#F59E0B"
                strokeWidth={1.5}
                dot={false}
                name="SMA 20"
              />
            )}

            {showSMA50 && (
              <Line
                type="monotone"
                dataKey="sma50"
                stroke="#A855F7"
                strokeWidth={1.5}
                dot={false}
                name="SMA 50"
              />
            )}

            {showBB && (
              <>
                <Line
                  type="monotone"
                  dataKey="bbUpper"
                  stroke="#06B6D4"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="bbLower"
                  stroke="#06B6D4"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={false}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
