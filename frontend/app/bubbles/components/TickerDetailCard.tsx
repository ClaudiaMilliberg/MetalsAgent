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

  const sentimentRingColor = {
    bullish: '#10b981',
    bearish: '#ef4444',
    neutral: '#f59e0b',
  }[ticker.sentiment];

  const baseColor = getTickerColor(ticker.commodity, ticker.ticker.colorOffset);

  // Filter headlines to English only
  const englishHeadlines = ticker.headlines.filter((headline) => {
    const asciiCount = (headline.match(/[A-Za-z0-9\s\-':.,&()!?]/g) || []).length;
    const totalChars = headline.length;

    if (asciiCount / totalChars > 0.8) return true;

    if (headline.match(/[一-鿿]|[ぁ-ん]|[ァ-ヴー]|[가-힣]|[א-ת]|[ء-ي]/)) {
      return false;
    }

    return true;
  });

  // Calculate circumference for SVG progress ring
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (ticker.sentimentScore / 100) * circumference;

  return (
    <div
      className="rounded-lg h-full overflow-y-auto p-6 flex flex-col"
      style={{
        backgroundColor: 'rgba(15, 20, 25, 0.8)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-700/50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-4xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
              {ticker.ticker.symbol}
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide uppercase">
              {ticker.ticker.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wide">{ticker.ticker.type}</p>
            <p className="text-xs text-slate-500 font-light">{ticker.ticker.sector}</p>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-end gap-4 mb-4">
          <div>
            <p className="text-sm text-slate-400 mb-1 uppercase tracking-wide">Current Price</p>
            <p className="text-4xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
              ${ticker.price.toFixed(2)}
            </p>
          </div>
          <div
            className={`text-2xl font-bold mb-1 ${
              ticker.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {ticker.change24h >= 0 ? '+' : ''}
            {ticker.change24h.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Sentiment Dial Section */}
      <div className="mb-6 pb-6 border-b border-slate-700/50">
        <p className="text-xs font-semibold text-slate-300 uppercase mb-4 tracking-wide">
          {ticker.sentiment} Sentiment
        </p>
        <div className="flex items-center gap-6">
          {/* Circular Progress Ring */}
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background ring */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="rgba(100, 116, 139, 0.2)"
                strokeWidth="6"
              />
              {/* Progress ring */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={sentimentRingColor}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.5s ease-in-out',
                  filter: 'drop-shadow(0 0 8px rgba(' + (sentimentRingColor === '#10b981' ? '16,185,129' : sentimentRingColor === '#ef4444' ? '239,68,68' : '245,158,11') + ',0.4))',
                }}
              />
            </svg>
            {/* Center text */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}
            >
              <p className="text-2xl font-bold text-white">
                {ticker.sentimentScore.toFixed(0)}
              </p>
              <p className="text-xs text-slate-400">/100</p>
            </div>
          </div>

          {/* Metrics Column */}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs text-slate-400 mb-1">Volatility</p>
              <p className="text-xl font-semibold text-white">{ticker.volatility.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Trading Volume</p>
              <p className="text-xl font-semibold text-white">
                {ticker.volume > 1000000
                  ? `${(ticker.volume / 1000000).toFixed(1)}M`
                  : `${(ticker.volume / 1000).toFixed(0)}K`}
              </p>
            </div>
            {ticker.marketCap && (
              <div>
                <p className="text-xs text-slate-400 mb-1">Market Cap</p>
                <p className="text-xl font-semibold text-white">
                  ${(ticker.marketCap / 1000000000).toFixed(1)}B
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signal Breakdown */}
      <div className="mb-6 pb-6 border-b border-slate-700/50">
        <p className="text-xs font-semibold text-slate-300 uppercase mb-4 tracking-wide">
          Signal Sources
        </p>
        <div className="space-y-4">
          {[
            { label: '🔴 Reddit', value: ticker.signals.reddit, color: '#ea580c' },
            { label: '📰 News', value: ticker.signals.news, color: '#f1f5f9' },
            { label: '𝕏 Twitter', value: ticker.signals.twitter, color: '#3b82f6' },
            { label: '⛓️ On-chain', value: ticker.signals.onchain, color: '#a855f7' },
          ].map((signal) => (
            <div key={signal.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-300">{signal.label}</span>
                <span className="text-sm font-semibold text-slate-200">{signal.value}%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'rgba(71, 85, 105, 0.3)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${signal.value}%`,
                    backgroundColor: signal.color,
                    boxShadow: `0 0 12px ${signal.color}40`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Headlines */}
      {englishHeadlines.length > 0 && (
        <div className="mb-6 pb-6 border-b border-slate-700/50">
          <p className="text-xs font-semibold text-slate-300 uppercase mb-3 tracking-wide">
            🗞️ Headlines (English Only)
          </p>
          <div className="space-y-2">
            {englishHeadlines.slice(0, 3).map((headline, i) => (
              <p
                key={i}
                className="text-xs leading-relaxed text-slate-300 line-clamp-2 hover:text-slate-200 transition-colors"
              >
                • {headline}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mt-auto">
        <div
          className="rounded-lg p-4 text-xs leading-relaxed text-slate-400"
          style={{
            backgroundColor: 'rgba(71, 85, 105, 0.1)',
            border: '1px solid rgba(100, 116, 139, 0.2)',
          }}
        >
          {ticker.ticker.description}
        </div>
      </div>
    </div>
  );
}
