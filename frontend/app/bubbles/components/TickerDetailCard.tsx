'use client';

import { CommodityType, getTickerColor } from '@/lib/commodity-tickers';

interface TickerData {
  ticker: { symbol: string; name: string; type: string; sector: string; description: string; colorOffset: number };
  commodity: CommodityType;
  price: number;
  change24h: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number;
  volatility: number;
  signals: {
    reddit: number;
    news: number;
    twitter: number;
    onchain: number;
  };
  headlines: string[];
  volume: number;
  marketCap?: number;
}

export default function TickerDetailCard({ ticker }: { ticker: TickerData }) {
  const sentimentColor = {
    bullish: 'text-emerald-400',
    bearish: 'text-red-400',
    neutral: 'text-amber-400',
  }[ticker.sentiment];

  const sentimentBgColor = {
    bullish: 'from-emerald-900/20 to-emerald-900/10',
    bearish: 'from-red-900/20 to-red-900/10',
    neutral: 'from-amber-900/20 to-amber-900/10',
  }[ticker.sentiment];

  const baseColor = getTickerColor(ticker.commodity, ticker.ticker.colorOffset);

  // Filter headlines to English only (simple heuristic: no common non-English patterns)
  const englishHeadlines = ticker.headlines.filter((headline) => {
    // Very simple English detection - exclude obvious non-English patterns
    // This is a basic filter; production would use language detection API
    return (
      /^[A-Za-z0-9\s\-':.,&()!?]+$/.test(headline) || // ASCII only
      (headline.length > 10 && !headline.match(/[一-鿿]/)) // No Chinese
    );
  });

  return (
    <div
      className={`rounded-lg border backdrop-blur-sm p-6 h-full overflow-y-auto bg-gradient-to-br ${sentimentBgColor} border-slate-600`}
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: baseColor,
      }}
    >
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-slate-600">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {ticker.ticker.symbol}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {ticker.ticker.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">{ticker.ticker.type}</p>
            <p className="text-xs text-slate-500">{ticker.ticker.sector}</p>
          </div>
        </div>

        <div className="flex items-baseline gap-3 mt-3">
          <p className="text-3xl font-bold text-white">
            ${ticker.price.toFixed(2)}
          </p>
          <p
            className={`text-lg font-semibold ${
              ticker.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {ticker.change24h >= 0 ? '+' : ''}
            {ticker.change24h.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Sentiment Gauge */}
      <div className="mb-4">
        <p className={`text-sm font-semibold ${sentimentColor} uppercase mb-2`}>
          {ticker.sentiment} Signal
        </p>
        <div className="w-full bg-slate-700/50 rounded-full h-3">
          <div
            className={`h-full rounded-full transition-all ${
              ticker.sentiment === 'bullish'
                ? 'bg-emerald-500'
                : ticker.sentiment === 'bearish'
                  ? 'bg-red-500'
                  : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(100, ticker.sentimentScore)}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Sentiment Score: {ticker.sentimentScore.toFixed(0)}/100
        </p>
      </div>

      {/* Key Metrics */}
      <div className="mb-4 pb-4 border-b border-slate-600 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Volatility</span>
          <span className="text-white font-semibold">
            {ticker.volatility.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Volume</span>
          <span className="text-white font-semibold">
            {ticker.volume > 1000000
              ? `${(ticker.volume / 1000000).toFixed(1)}M`
              : `${(ticker.volume / 1000).toFixed(0)}K`}
          </span>
        </div>
        {ticker.marketCap && (
          <div className="flex justify-between">
            <span className="text-slate-400">Market Cap</span>
            <span className="text-white font-semibold">
              ${(ticker.marketCap / 1000000000).toFixed(1)}B
            </span>
          </div>
        )}
      </div>

      {/* Signal Breakdown */}
      <div className="mb-4 pb-4 border-b border-slate-600">
        <p className="text-xs font-semibold text-slate-300 uppercase mb-3">
          Signal Sources
        </p>
        <div className="space-y-3 text-xs">
          {/* Reddit */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">🔴 Reddit</span>
              <span className="text-slate-400">{ticker.signals.reddit}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded h-1.5">
              <div
                className="h-full rounded bg-orange-600"
                style={{ width: `${ticker.signals.reddit}%` }}
              ></div>
            </div>
          </div>

          {/* News */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">📰 News</span>
              <span className="text-slate-400">{ticker.signals.news}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded h-1.5">
              <div
                className="h-full rounded bg-white/60"
                style={{ width: `${ticker.signals.news}%` }}
              ></div>
            </div>
          </div>

          {/* Twitter */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">𝕏 Twitter</span>
              <span className="text-slate-400">{ticker.signals.twitter}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded h-1.5">
              <div
                className="h-full rounded bg-blue-600"
                style={{ width: `${ticker.signals.twitter}%` }}
              ></div>
            </div>
          </div>

          {/* On-chain */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">⛓️ On-chain</span>
              <span className="text-slate-400">{ticker.signals.onchain}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded h-1.5">
              <div
                className="h-full rounded bg-purple-600"
                style={{ width: `${ticker.signals.onchain}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Headlines - English Only */}
      {englishHeadlines.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-300 uppercase mb-2">
            🗞️ Top Headlines (English)
          </p>
          <div className="space-y-2 text-xs">
            {englishHeadlines.slice(0, 3).map((headline, i) => (
              <p
                key={i}
                className="text-slate-300 line-clamp-2 leading-tight"
              >
                • {headline}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="text-xs text-slate-400 bg-slate-700/20 rounded p-3">
        <p className="leading-relaxed">{ticker.ticker.description}</p>
      </div>
    </div>
  );
}
