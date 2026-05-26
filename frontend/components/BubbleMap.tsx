'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { mockCommodities, mockBubblePositions } from '@/lib/mockData';

type Sentiment = 'bullish' | 'bearish' | 'neutral';

const sentimentColors: Record<Sentiment, string> = {
  bullish: '#10B981', // Green
  bearish: '#EF4444', // Red
  neutral: '#F59E0B', // Amber
};

const sentimentLabels: Record<Sentiment, string> = {
  bullish: 'Bullish',
  bearish: 'Bearish',
  neutral: 'Neutral',
};

interface Bubble {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  change24h: number;
  sentiment: Sentiment;
  volatility: number;
  emoji: string;
}

export default function BubbleMap({ commodities = mockCommodities }: { commodities?: Bubble[] }) {
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);

  const viewBox = '0 0 1000 600';
  const padding = 120;

  // Animated bubble positions (in production, these would be calculated from real data)
  const bubblePositions = useMemo(() => {
    return {
      copper: { x: 200, y: 200, size: 150 },
      nickel: { x: 750, y: 150, size: 120 },
      zinc: { x: 100, y: 450, size: 100 },
      gold: { x: 700, y: 450, size: 140 },
    };
  }, []);

  return (
    <div className="relative w-full h-full glass-premium rounded-2xl overflow-hidden">
      {/* SVG Bubble Map */}
      <svg
        viewBox={viewBox}
        className="w-full h-full"
        style={{ backgroundColor: 'transparent' }}
      >
        {/* Grid background with depth */}
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.15" />
          </pattern>
          <pattern id="grid-major" width="400" height="400" patternUnits="userSpaceOnUse">
            <path d="M 400 0 L 0 0 0 400" fill="none" stroke="#475569" strokeWidth="1" opacity="0.1" />
          </pattern>
          <linearGradient id="grid-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.05)" />
            <stop offset="50%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0.05)" />
          </linearGradient>
        </defs>
        <rect width="1000" height="600" fill="url(#grid-major)" />
        <rect width="1000" height="600" fill="url(#grid)" />
        <rect width="1000" height="600" fill="url(#grid-fade)" />

        {/* Bubbles */}
        {commodities.map((commodity) => {
          const pos = bubblePositions[commodity.id as keyof typeof bubblePositions];
          if (!pos) return null;

          const isHovered = hoveredBubble === commodity.id;
          const color = sentimentColors[commodity.sentiment];

          return (
            <g
              key={commodity.id}
              onMouseEnter={() => setHoveredBubble(commodity.id)}
              onMouseLeave={() => setHoveredBubble(null)}
              style={{ cursor: 'pointer' }}
              className="transition-all duration-500"
            >
              {/* LAYER 1: Deep shadow beneath */}
              <ellipse
                cx={pos.x}
                cy={pos.y + pos.size + 8}
                rx={pos.size * 0.85}
                ry={pos.size * 0.15}
                fill="black"
                opacity="0.25"
                style={{
                  filter: 'blur(8px)',
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />

              {/* LAYER 2: Outer glow (sentiment color) */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={pos.size + (isHovered ? 30 : 15)}
                fill={color}
                opacity={isHovered ? 0.2 : 0.08}
                style={{
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />

              {/* LAYER 3: Gradients & Filters */}
              <defs>
                <radialGradient id={`bubble-gradient-${commodity.id}`} cx="35%" cy="35%">
                  <stop offset="0%" stopColor={color} stopOpacity="1" />
                  <stop offset="70%" stopColor={color} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.7" />
                </radialGradient>
                <filter id={`bubble-shadow-${commodity.id}`}>
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                </filter>
              </defs>

              {/* LAYER 4: Main bubble with radial gradient */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={pos.size}
                fill={`url(#bubble-gradient-${commodity.id})`}
                filter={`url(#bubble-shadow-${commodity.id})`}
                opacity={isHovered ? 1 : 0.9}
                style={{
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: isHovered
                    ? `drop-shadow(0 0 25px ${color}) drop-shadow(0 8px 16px rgba(0,0,0,0.5))`
                    : `drop-shadow(0 0 12px ${color}) drop-shadow(0 4px 8px rgba(0,0,0,0.3))`,
                }}
              />

              {/* LAYER 5: Rim light - top-left highlight */}
              <circle
                cx={pos.x - pos.size * 0.25}
                cy={pos.y - pos.size * 0.25}
                r={pos.size * 0.4}
                fill="white"
                opacity={isHovered ? 0.25 : 0.15}
                style={{
                  mixBlendMode: 'screen',
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />

              {/* LAYER 6: Inner shadow - bottom-right */}
              <circle
                cx={pos.x + pos.size * 0.2}
                cy={pos.y + pos.size * 0.2}
                r={pos.size * 0.3}
                fill="black"
                opacity={isHovered ? 0.2 : 0.1}
                style={{
                  mixBlendMode: 'multiply',
                }}
              />

              {/* LAYER 7: Border - subtle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={pos.size}
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                opacity={isHovered ? 0.3 : 0.1}
                style={{
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />

              {/* TEXT: TICKER SYMBOL - DOMINANT */}
              <text
                x={pos.x}
                y={pos.y - 15}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={pos.size * 0.5}
                fontWeight="800"
                fill="white"
                fontFamily="'Monaco', 'Courier New', monospace"
                letterSpacing="-1"
                style={{
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                }}
              >
                {commodity.symbol}
              </text>

              {/* TEXT: PRICE */}
              <text
                x={pos.x}
                y={pos.y + pos.size * 0.15}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={pos.size * 0.28}
                fontWeight="700"
                fill="white"
                fontFamily="'Monaco', 'Courier New', monospace"
                opacity="0.95"
              >
                ${commodity.currentPrice.toFixed(0)}
              </text>

              {/* TEXT: CHANGE % */}
              <text
                x={pos.x}
                y={pos.y + pos.size * 0.35}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={pos.size * 0.2}
                fontWeight="600"
                fill={commodity.change24h > 0 ? '#10B981' : commodity.change24h < 0 ? '#EF4444' : '#F59E0B'}
                fontFamily="'Monaco', 'Courier New', monospace"
                opacity="0.9"
              >
                {commodity.change24h > 0 ? '+' : ''}{commodity.change24h.toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Enhanced Hover Detail Card with Animation */}
      {hoveredBubble && (
        <motion.div
          initial={{ opacity: 0, x: -20, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute bottom-12 left-6 glass-premium-strong rounded-xl p-7 min-w-[320px] pointer-events-none z-50"
        >
          {commodities.find((c) => c.id === hoveredBubble) && (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {commodities.find((c) => c.id === hoveredBubble)?.name}
                  </h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">
                    {commodities.find((c) => c.id === hoveredBubble)?.symbol}
                  </p>
                </div>
                <span className="text-4xl">
                  {commodities.find((c) => c.id === hoveredBubble)?.emoji}
                </span>
              </div>

              {/* Price - Dominant */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Current Price</p>
                <p className="text-3xl font-black text-white font-mono tracking-tight">
                  ${commodities.find((c) => c.id === hoveredBubble)?.currentPrice.toFixed(2)}
                </p>
              </div>

              {/* Change */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">24h Change</p>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-2xl font-bold font-mono ${
                      (commodities.find((c) => c.id === hoveredBubble)?.change24h ?? 0) > 0
                        ? 'text-green-400'
                        : (commodities.find((c) => c.id === hoveredBubble)?.change24h ?? 0) < 0
                        ? 'text-red-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {(commodities.find((c) => c.id === hoveredBubble)?.change24h ?? 0) > 0 ? '+' : ''}
                    {commodities.find((c) => c.id === hoveredBubble)?.change24h.toFixed(2)}%
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      (commodities.find((c) => c.id === hoveredBubble)?.change24h ?? 0) > 0
                        ? 'text-green-400'
                        : (commodities.find((c) => c.id === hoveredBubble)?.change24h ?? 0) < 0
                        ? 'text-red-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {(commodities.find((c) => c.id === hoveredBubble)?.change24h ?? 0) > 0
                      ? '▲'
                      : (commodities.find((c) => c.id === hoveredBubble)?.change24h ?? 0) < 0
                      ? '▼'
                      : '●'}
                  </span>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Volatility</p>
                  <p className="text-lg font-bold text-white">
                    {commodities.find((c) => c.id === hoveredBubble)?.volatility.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Sentiment</p>
                  <span
                    className="inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor:
                        sentimentColors[commodities.find((c) => c.id === hoveredBubble)?.sentiment || 'neutral'] +
                        '40',
                      color: sentimentColors[commodities.find((c) => c.id === hoveredBubble)?.sentiment || 'neutral'],
                    }}
                  >
                    {sentimentLabels[commodities.find((c) => c.id === hoveredBubble)?.sentiment || 'neutral']}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute top-6 right-6 glass-premium rounded-lg p-3 text-xs space-y-2">
        <div className="font-bold text-white mb-2">Sentiment</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
          <span className="text-gray-300">Bullish</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }}></div>
          <span className="text-gray-300">Bearish</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }}></div>
          <span className="text-gray-300">Neutral</span>
        </div>
      </div>

      {/* Last updated indicator */}
      <div className="absolute bottom-6 right-6 text-xs text-gray-500">
        Updated 2 seconds ago
      </div>
    </div>
  );
}
