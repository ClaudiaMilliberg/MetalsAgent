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
    <div
      className="bg-gradient-to-br from-secondary to-primary border border-gray-700/50 rounded-xl p-4 hover:border-gray-600/50 hover:shadow-lg transition-all duration-300 backdrop-blur group cursor-pointer"
      style={{
        borderColor: sentiment === 'bullish' ? colors.bg + '33' : sentiment === 'bearish' ? colors.bg + '33' : colors.bg + '1a',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <div>
            <h3 className="text-sm font-semibold text-white">{name}</h3>
            <p className="text-xs text-gray-400">{symbol}</p>
          </div>
        </div>

        {/* Sentiment badge */}
        <div
          className="px-2 py-1 rounded-full text-xs font-bold"
          style={{
            backgroundColor: colors.light,
            color: colors.text,
          }}
        >
          {sentiment === 'bullish' ? '📈' : sentiment === 'bearish' ? '📉' : '➡️'}
        </div>
      </div>

      {/* Price */}
      <div className="mb-3">
        <p className="text-2xl font-bold text-white font-mono">${currentPrice.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-sm font-semibold font-mono"
            style={{
              color: change24h > 0 ? '#10B981' : change24h < 0 ? '#EF4444' : '#F59E0B',
            }}
          >
            {change24h > 0 ? '+' : ''}{change24h.toFixed(2)}%
          </span>
          <span
            className="text-sm"
            style={{
              color: change24h > 0 ? '#10B981' : change24h < 0 ? '#EF4444' : '#F59E0B',
            }}
          >
            {change24h > 0 ? '▲' : change24h < 0 ? '▼' : '●'}
          </span>
        </div>
      </div>

      {/* Mini chart sparkline */}
      <div className="mb-3 h-12 -mx-2">
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
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-700/30">
        <div>
          <p className="text-xs text-gray-400">Volatility</p>
          <p className="text-sm font-semibold text-white">{volatility.toFixed(1)}%</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">24h Range</p>
          <p className="text-sm font-semibold text-white">${(currentPrice * 0.03).toFixed(2)}</p>
        </div>
      </div>

      {/* Hover effect - subtle animation */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}
