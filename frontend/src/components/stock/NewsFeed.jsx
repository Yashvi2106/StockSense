import React from 'react';
import { ExternalLink, Clock, TrendingUp, TrendingDown, Minus, Newspaper, ShieldAlert } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const NewsFeed = ({ newsData, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-28 bg-gray-900/60 rounded-2xl border border-gray-800"></div>
        <div className="h-36 bg-gray-900/60 rounded-2xl border border-gray-800"></div>
        <div className="h-36 bg-gray-900/60 rounded-2xl border border-gray-800"></div>
      </div>
    );
  }

  if (!newsData || !newsData.articles || newsData.articles.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-gray-900/40 border border-gray-800 text-center text-xs text-gray-400">
        No recent financial headlines found for this stock.
      </div>
    );
  }

  const { sentimentSummary, articles } = newsData;

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60';
      case 'negative':
        return 'bg-rose-950/60 text-rose-400 border-rose-800/60';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Sentiment Distribution Summary Bar */}
      {sentimentSummary && (
        <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Financial News Sentiment Analysis
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Evaluated by domain financial lexicon NLP with sentiment confidence weighting
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Overall Stance:</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getSentimentBadge(sentimentSummary.overall.toLowerCase())}`}>
                {sentimentSummary.overall} ({sentimentSummary.averageScore > 0 ? '+' : ''}{sentimentSummary.averageScore})
              </span>
            </div>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Positive Sentiment
                </span>
                <span className="text-gray-300">{sentimentSummary.positivePercent}%</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${sentimentSummary.positivePercent}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Minus className="w-3.5 h-3.5" /> Neutral Sentiment
                </span>
                <span className="text-gray-300">{sentimentSummary.neutralPercent}%</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-500 rounded-full transition-all duration-500"
                  style={{ width: `${sentimentSummary.neutralPercent}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-400 flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5" /> Negative Sentiment
                </span>
                <span className="text-gray-300">{sentimentSummary.negativePercent}%</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${sentimentSummary.negativePercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-4">
        {articles.map((article, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-gray-700/80 transition shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <a
                  href={article.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sm text-white hover:text-indigo-400 transition flex items-start gap-1.5 group"
                >
                  <span>{article.title}</span>
                  {article.url && (
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-indigo-400 flex-shrink-0 mt-1" />
                  )}
                </a>

                <div className="flex items-center gap-3 text-[11px] text-gray-400 flex-wrap">
                  <span className="font-semibold text-gray-300">{article.source}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
              </div>

              {/* Sentiment Badge & Score */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getSentimentBadge(article.sentiment)}`}>
                  {article.sentiment}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  Score: {article.sentimentScore > 0 ? '+' : ''}{article.sentimentScore}
                </span>
                <span className="text-[9px] text-gray-500">
                  Conf: {Math.round(article.confidence * 100)}%
                </span>
              </div>
            </div>

            {article.description && (
              <p className="text-xs text-gray-400 leading-relaxed">
                {article.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
