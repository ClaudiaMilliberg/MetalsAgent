'use client';

import { useMemo } from 'react';

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

export default function PriceCard({
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
    <div className="glass-premium rounded-xl p-5 group cursor-pointer hover:border-blue-500/30 transition-all duration-500 ease-premium hover:-translate-y-1 relative">
      {/* Header with emoji and sentiment */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <h3 className="text-sm font-bold text-white">{name}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{symbol}</p>
          </div>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
          style={{
            backgroundColor: colors.light,
            color: colors.text,
          }}
        >
          {sentiment === 'bullish' ? '▲' : sentiment === 'bearish' ? '▼' : '●'}
        </div>
      </div>

      {/* Price - Large and Dominant */}
      <div className="mb-4">
        <p className="text-3xl font-black text-white font-mono tracking-tight">${currentPrice.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className="text-lg font-bold font-mono"
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
      <div className="mb-4 h-12 -mx-2">
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
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Volatility</p>
          <p className="text-sm font-bold text-white">{volatility.toFixed(1)}%</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">24h Range</p>
          <p className="text-sm font-bold text-white">${(currentPrice * 0.03).toFixed(2)}</p>
        </div>
      </div>

      {/* Hover effect - subtle shimmer animation */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}
