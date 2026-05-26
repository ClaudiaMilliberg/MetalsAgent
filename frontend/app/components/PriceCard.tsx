'use client';

import { useMemo, memo } from 'react';

type Sentiment = 'bullish' | 'bearish' | 'neutral';

const sentimentColors: Record<Sentiment, { bg: string; text: string; light: string }> = {
  bullish: { bg: '#10B981', text: '#10B981', light: '#10B98126' },
  bearish: { bg: '#EF4444', text: '#EF4444', light: '#EF444426' },
  neutral: { bg: '#F59E0B', text: '#F59E0B', light: '#F59E0B26' },
};

interface PriceCardProps {
  name: string;
  symbol: string;
  currentPrice: number;
  change24h: number;
  sentiment: Sentiment;
  volatility: number;
  emoji: string;
  priceHistory: number[];
}

function PriceCard({
  name,
  symbol,
  currentPrice,
  change24h,
  sentiment,
  volatility,
  emoji,
  priceHistory,
}: PriceCardProps) {
  const colors = sentimentColors[sentiment];

  // Generate mini sparkline
  const sparklinePoints = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return '';

    const min = Math.min(...priceHistory);
    const max = Math.max(...priceHistory);
    const range = max - min || 1;

    const points = priceHistory.map((price, index) => {
      const x = (index / (priceHistory.length - 1)) * 100;
      const y = 30 - ((price - min) / range) * 30;
      return `${x},${y}`;
    });

    return points.join(' ');
  }, [priceHistory]);

  return (
    <div className="glass-premium rounded-xl sm:rounded-2xl p-5 sm:p-6 group cursor-pointer hover:glass-premium-strong transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-xl relative overflow-hidden border-white/10 hover:border-blue-500/30">
      {/* Header with emoji and sentiment */}
      <div className="flex justify-between items-start mb-5 sm:mb-6 gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <span className="text-2.5xl sm:text-3xl flex-shrink-0">{emoji}</span>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white truncate">{name}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{symbol}</p>
          </div>
        </div>
        <div
          className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex-shrink-0"
          style={{
            backgroundColor: colors.light,
            color: colors.text,
          }}
        >
          {sentiment === 'bullish' ? '▲' : sentiment === 'bearish' ? '▼' : '●'}
        </div>
      </div>

      {/* Price - Large and Dominant */}
      <div className="mb-4 sm:mb-5">
        <p className="text-2.5xl sm:text-3xl lg:text-4xl font-black text-white font-mono tracking-tight">${currentPrice.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className="text-base sm:text-lg font-bold font-mono"
            style={{
              color: change24h > 0 ? '#10B981' : change24h < 0 ? '#EF4444' : '#F59E0B',
            }}
          >
            {change24h > 0 ? '+' : ''}{change24h.toFixed(2)}%
          </span>
          <span
            style={{
              color: change24h > 0 ? '#10B981' : change24h < 0 ? '#EF4444' : '#F59E0B',
            }}
          >
            {change24h > 0 ? '▲' : change24h < 0 ? '▼' : '●'}
          </span>
        </div>
      </div>

      {/* Mini chart sparkline */}
      <div className="mb-4 sm:mb-5 h-10 sm:h-12 -mx-2">
        <svg
          viewBox="0 0 100 40"
          className="w-full h-full"
          style={{
            overflow: 'visible',
          }}
        >
          {/* Chart area */}
          <defs>
            <linearGradient id={`gradient-${symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.bg} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colors.bg} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area under line */}
          {sparklinePoints && (
            <polyline
              points={`0,40 ${sparklinePoints} 100,40`}
              fill={`url(#gradient-${symbol})`}
              stroke="none"
            />
          )}

          {/* Line */}
          {sparklinePoints && (
            <polyline
              points={sparklinePoints}
              fill="none"
              stroke={colors.bg}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-2 gap-3 pt-4 sm:pt-5 border-t border-white/10">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Volatility</p>
          <p className="text-sm sm:text-base font-bold text-white">{volatility.toFixed(1)}%</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">24h Range</p>
          <p className="text-sm sm:text-base font-bold text-white">${(currentPrice * 0.03).toFixed(2)}</p>
        </div>
      </div>

      {/* Hover effect - subtle shimmer animation */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(PriceCard)
