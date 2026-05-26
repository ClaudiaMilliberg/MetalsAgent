'use client';

import { CommodityData } from '@/hooks/useCommodities';

interface Props {
  commodity: CommodityData;
  sentimentData?: {
    sentiment: 'bullish' | 'bearish' | 'neutral';
    score: number;
    mentionCount: number;
    articles: Array<{
      title: string;
      source: string;
      url: string;
    }>;
  };
}

export function CommodityCard({ commodity, sentimentData }: Props) {
  const sentimentColor = {
    bullish: 'text-green-400',
    bearish: 'text-red-400',
    neutral: 'text-slate-400',
  }[commodity.sentiment];

  const sentimentBg = {
    bullish: 'bg-green-900/20 border-green-500/30',
    bearish: 'bg-red-900/20 border-red-500/30',
    neutral: 'bg-slate-700/30 border-slate-600/30',
  }[commodity.sentiment];

  const sentimentIcon = {
    bullish: '📈',
    bearish: '📉',
    neutral: '➡️',
  }[commodity.sentiment];

  return (
    <div
      className={`rounded-lg border backdrop-blur-sm p-6 transition-all hover:scale-105 ${sentimentBg}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-400 mb-1">{commodity.name}</p>
          <p className="text-3xl font-bold text-white">{commodity.emoji}</p>
        </div>
        <div className={`text-xl ${sentimentColor}`}>{sentimentIcon}</div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-white">
          ${commodity.currentPrice.toFixed(2)}
        </p>
        <p className={`text-sm ${commodity.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {commodity.change24h >= 0 ? '+' : ''}
          {commodity.change24h.toFixed(2)}%
        </p>
      </div>

      {/* Sentiment */}
      <div className="pt-4 border-t border-slate-600">
        <p className={`text-sm font-semibold ${sentimentColor} capitalize`}>
          {commodity.sentiment}
        </p>
        {sentimentData?.mentionCount && (
          <p className="text-xs text-slate-400 mt-1">
            {sentimentData.mentionCount} mentions in news
          </p>
        )}
      </div>

      {/* Articles Preview */}
      {sentimentData?.articles && sentimentData.articles.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-600">
          <a
            href={sentimentData.articles[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 line-clamp-2"
          >
            📰 {sentimentData.articles[0].title}
          </a>
        </div>
      )}
    </div>
  );
}
