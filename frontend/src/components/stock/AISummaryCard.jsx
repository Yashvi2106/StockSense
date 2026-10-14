import React from 'react';
import { Brain, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

export const AISummaryCard = ({ summary, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-gray-900/60 border border-indigo-500/20 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-gray-800 rounded"></div>
        <div className="h-16 w-full bg-gray-800/60 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="h-24 bg-gray-800/40 rounded"></div>
          <div className="h-24 bg-gray-800/40 rounded"></div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const signalColor =
    summary.overallSignal?.includes('Bullish') ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60' :
    summary.overallSignal?.includes('Bearish') ? 'text-rose-400 bg-rose-950/60 border-rose-800/60' :
    'text-amber-400 bg-amber-950/60 border-amber-800/60';

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-gray-900 via-indigo-950/25 to-gray-900 border border-indigo-500/30 shadow-xl space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Today&apos;s {summary.symbol} Intelligence
            </h3>
            <p className="text-[11px] text-gray-400">
              Synthesized from price action, technical momentum, news NLP, and risk models
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${signalColor}`}>
            Signal: {summary.overallSignal}
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-800 text-gray-400 hover:text-white transition"
              title="Regenerate intelligence summary"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Executive Narrative */}
      <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line space-y-2">
        {summary.executiveSummary}
      </div>

      {/* Structured Catalysts vs Risk Factors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-800/80">
        {/* Positive Catalysts */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            Positive Market Catalysts
          </h4>
          <ul className="text-xs text-gray-300 space-y-2 pl-0.5">
            {summary.positiveFactors?.map((factor, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk & Cautionary Factors */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            Risk & Cautionary Factors
          </h4>
          <ul className="text-xs text-gray-300 space-y-2 pl-0.5">
            {summary.riskFactors?.map((factor, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Grounding Disclaimer */}
      <div className="text-[10px] text-gray-500 pt-2 flex items-center justify-between border-t border-gray-800/60">
        <span>Grounded strictly in calculated metrics and verified headlines. No simulated advice.</span>
        <span>Generated: {new Date(summary.generatedAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};
