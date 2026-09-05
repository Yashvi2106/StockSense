import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const MetricCard = ({
  title,
  value,
  change,
  changePercent,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'indigo'
}) => {
  const isPositive = change > 0 || (typeof changePercent === 'number' && changePercent > 0);
  const isNegative = change < 0 || (typeof changePercent === 'number' && changePercent < 0);

  const badgeStyles = {
    indigo: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    rose: 'bg-rose-950/60 text-rose-300 border-rose-800/60'
  };

  return (
    <div className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800/80 hover:border-gray-700/80 transition shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">{title}</span>
        {badge && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeStyles[badgeColor] || badgeStyles.indigo}`}>
            {badge}
          </span>
        )}
        {Icon && !badge && (
          <div className="w-8 h-8 rounded-lg bg-gray-800/80 flex items-center justify-center text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>

        {(change != null || changePercent != null) && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
              isPositive
                ? 'text-emerald-400 bg-emerald-950/40'
                : isNegative
                ? 'text-rose-400 bg-rose-950/40'
                : 'text-gray-400 bg-gray-800/50'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : isNegative ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {changePercent != null ? `${changePercent}%` : change}
            </span>
          </div>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};
