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
    <div className="relative w-full h-full glass-premium-strong rounded-2xl overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-purple-950/20 pointer-events-none"></div>

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

              {/* LAYER 1.5: Enhanced outer atmosphere halo */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={pos.size + (isHovered ? 60 : 30)}
                fill={color}
                opacity={isHovered ? 0.15 : 0.06}
                style={{
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: `blur(${isHovered ? 20 : 16}px)`,
                }}
              />

              {/* LAYER 2: Outer glow halo (sentiment color, scales with intensity) */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={pos.size + (isHovered ? 45 : 25)}
                fill={color}
                opacity={isHovered ? 0.30 : 0.15}
                style={{
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: `blur(${isHovered ? 14 : 10}px)`,
                  animation: 'breathing 5s ease-in-out infinite',
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
                opacity={1}
                style={{
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: isHovered
                    ? `drop-shadow(0 0 35px ${color}) drop-shadow(0 0 50px ${color}80) drop-shadow(0 12px 24px rgba(0,0,0,0.6))`
                    : `drop-shadow(0 0 20px ${color}) drop-shadow(0 0 35px ${color}60) drop-shadow(0 8px 16px rgba(0,0,0,0.4))`,
                }}
              />

              {/* LAYER 5: Rim light - top-left highlight (enhanced) */}
              <circle
                cx={pos.x - pos.size * 0.3}
                cy={pos.y - pos.size * 0.3}
                r={pos.size * 0.5}
                fill="white"
                opacity={isHovered ? 0.35 : 0.2}
                style={{
                  mixBlendMode: 'screen',
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />

              {/* LAYER 5.5: Specular highlight dot - bright light source */}
              <circle
                cx={pos.x - pos.size * 0.35}
                cy={pos.y - pos.size * 0.35}
                r={pos.size * 0.12}
                fill="white"
                opacity={isHovered ? 0.8 : 0.6}
                style={{
                  mixBlendMode: 'screen',
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: 'blur(1px)',
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

              {/* TEXT: COMMODITY NAME - Large and clear */}
              <text
                x={pos.x}
                y={pos.y - 25}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={pos.size * 0.55}
                fontWeight="900"
                fill="white"
                fontFamily="'Monaco', 'Courier New', monospace"
                letterSpacing="-2"
                style={{
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: isHovered
                    ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                    : 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {commodity.symbol}
              </text>

              {/* TEXT: PRICE - Large and prominent */}
              <text
                x={pos.x}
                y={pos.y + 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={pos.size * 0.32}
                fontWeight="800"
                fill="white"
                fontFamily="'Monaco', 'Courier New', monospace"
                style={{
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: isHovered
                    ? 'drop-shadow(0 0 6px rgba(255,255,255,0.6)) drop-shadow(0 3px 6px rgba(0,0,0,0.5))'
                    : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                }}
              >
                ${commodity.currentPrice.toFixed(2)}
              </text>

              {/* TEXT: CHANGE % - Colored and bold */}
              <text
                x={pos.x}
                y={pos.y + 32}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={pos.size * 0.24}
                fontWeight="700"
                fill={commodity.change24h > 0 ? '#4ADE80' : commodity.change24h < 0 ? '#FF6B6B' : '#FBBF24'}
                fontFamily="'Monaco', 'Courier New', monospace"
                style={{
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
                }}
              >
                {commodity.change24h > 0 ? '↑' : commodity.change24h < 0 ? '↓' : '→'} {Math.abs(commodity.change24h).toFixed(2)}%
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
          className="absolute bottom-12 left-4 right-4 sm:left-6 sm:right-auto sm:min-w-[340px] glass-premium-strong rounded-xl p-6 sm:p-7 pointer-events-none z-50"
        >
          {commodities.find((c) => c.id === hoveredBubble) && (
            <div className="space-y-5">
              {/* Header with Enhanced Typography */}
              <div className="flex items-start justify-between pb-6 border-b border-white/20">
                <div>
                  <h3 className="text-3xl font-black text-white mb-1 bg-clip-text">
                    {commodities.find((c) => c.id === hoveredBubble)?.name}
                  </h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                    {commodities.find((c) => c.id === hoveredBubble)?.symbol}
                  </p>
                </div>
                <span className="text-6xl opacity-95">
                  {commodities.find((c) => c.id === hoveredBubble)?.emoji}
                </span>
              </div>

              {/* Price - Dominant (7xl for ultra premium feel) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.4 }}
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 font-bold">Current Price</p>
                <p className="text-7xl font-black text-white font-mono tracking-tighter leading-none" style={{
                  textShadow: '0 4px 16px rgba(59, 130, 246, 0.35)'
                }}>
                  ${commodities.find((c) => c.id === hoveredBubble)?.currentPrice.toFixed(2)}
                </p>
              </motion.div>

              {/* Change */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-bold">24h Change</p>
                <div className="flex items-baseline gap-3">
                  <span
                    className={`text-3xl font-black font-mono ${
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
                    className={`text-2xl font-bold ${
                      (commodities.find((c) => c.id === hoveredBubble)?.change24h ?? 0) > 0
                        ? 'text-green-400'
                        : (commodities.find((c) => c.id === hoveredBubble)?.change24h ?? 0) < 0
                        ? 'text-red-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {(commodities.find((c) => c.id === hoveredBubble)?.change24h ?? 0) > 0
                      ? '↑'
                      : (commodities.find((c) => c.id === hoveredBubble)?.change24h ?? 0) < 0
                      ? '↓'
                      : '→'}
                  </span>
                </div>
              </motion.div>

              {/* Data Grid */}
              <motion.div
                className="grid grid-cols-2 gap-5 pt-6 border-t border-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="glass-premium rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold">Volatility</p>
                  <p className="text-2xl font-black text-white">
                    {commodities.find((c) => c.id === hoveredBubble)?.volatility.toFixed(1)}%
                  </p>
                </div>
                <div className="glass-premium rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold">Sentiment</p>
                  <span
                    className="inline-block px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor:
                        sentimentColors[commodities.find((c) => c.id === hoveredBubble)?.sentiment || 'neutral'] +
                        '60',
                      color: sentimentColors[commodities.find((c) => c.id === hoveredBubble)?.sentiment || 'neutral'],
                    }}
                  >
                    {sentimentLabels[commodities.find((c) => c.id === hoveredBubble)?.sentiment || 'neutral']}
                  </span>
                </div>
              </motion.div>
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
