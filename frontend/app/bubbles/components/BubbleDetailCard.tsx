'use client';

interface Commodity {
  id: string;
  name: string;
  price: number;
  change24h: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  volatility: number;
  signalBreakdown: {
    reddit: number;
    news: number;
    twitter: number;
    onchain: number;
  };
  headlines: string[];
  demand: string;
  confidence: number;
}

export default function BubbleDetailCard({ commodity }: { commodity: Commodity }) {
  const sentimentColor = {
    bullish: 'text-emerald-400',
    bearish: 'text-red-400',
    neutral: 'text-amber-400',
  }[commodity.sentiment];

  const sentimentBg = {
    bullish: 'bg-emerald-900/20 border-emerald-500/30',
    bearish: 'bg-red-900/20 border-red-500/30',
    neutral: 'bg-amber-900/20 border-amber-500/30',
  }[commodity.sentiment];

  return (
    <div className={`rounded-lg border backdrop-blur-sm p-6 h-96 overflow-y-auto ${sentimentBg}`}>
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-slate-600">
        <h2 className="text-2xl font-bold text-white mb-2">{commodity.name}</h2>
        <div className="flex items-baseline gap-3">
          <p className="text-3xl font-bold text-white">${commodity.price.toFixed(2)}</p>
          <p className={`text-lg font-semibold ${commodity.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {commodity.change24h >= 0 ? '+' : ''}
            {commodity.change24h.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Sentiment */}
      <div className="mb-4">
        <p className={`text-sm font-semibold ${sentimentColor} uppercase mb-2`}>{commodity.sentiment}</p>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div
            className={`h-full rounded-full transition-all ${
              commodity.sentiment === 'bullish'
                ? 'bg-emerald-500'
                : commodity.sentiment === 'bearish'
                ? 'bg-red-500'
                : 'bg-amber-500'
            }`}
            style={{ width: `${commodity.score}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-400 mt-1">Sentiment Score: {commodity.score.toFixed(0)}/100</p>
      </div>

      {/* Signal Breakdown */}
      <div className="mb-4 pb-4 border-b border-slate-600">
        <p className="text-xs font-semibold text-slate-300 uppercase mb-3">Signal Breakdown</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">🔴 Reddit</span>
            <span className="text-slate-400">{commodity.signalBreakdown.reddit}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded h-1">
            <div
              className="h-full rounded bg-orange-600"
              style={{ width: `${commodity.signalBreakdown.reddit}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs mt-3">
            <span className="text-slate-300">📰 News</span>
            <span className="text-slate-400">{commodity.signalBreakdown.news}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded h-1">
            <div
              className="h-full rounded bg-white/50"
              style={{ width: `${commodity.signalBreakdown.news}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs mt-3">
            <span className="text-slate-300">𝕏 Twitter</span>
            <span className="text-slate-400">{commodity.signalBreakdown.twitter}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded h-1">
            <div
              className="h-full rounded bg-blue-600"
              style={{ width: `${commodity.signalBreakdown.twitter}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs mt-3">
            <span className="text-slate-300">⛓️ On-chain</span>
            <span className="text-slate-400">{commodity.signalBreakdown.onchain}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded h-1">
            <div
              className="h-full rounded bg-purple-600"
              style={{ width: `${commodity.signalBreakdown.onchain}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Headlines */}
      {commodity.headlines.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-300 uppercase mb-2">Top Headlines</p>
          <div className="space-y-2 text-xs">
            {commodity.headlines.slice(0, 3).map((headline, i) => (
              <p key={i} className="text-slate-300 line-clamp-2">
                • {headline}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Demand & Confidence */}
      <div className="text-xs text-slate-400 space-y-1">
        <p>
          <span className="font-semibold text-slate-300">Demand:</span> {commodity.demand}
        </p>
        <p>
          <span className="font-semibold text-slate-300">7-day Confidence:</span>{' '}
          {commodity.confidence.toFixed(0)}%
        </p>
      </div>
    </div>
  );
}
