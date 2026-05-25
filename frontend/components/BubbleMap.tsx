'use client';

import { useState, useMemo } from 'react';
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
    <div className="relative w-full h-full bg-gradient-to-br from-secondary to-primary rounded-2xl overflow-hidden border border-gray-700/50">
      {/* SVG Bubble Map */}
      <svg
        viewBox={viewBox}
        className="w-full h-full"
        style={{ backgroundColor: 'transparent' }}
      >
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="1000" height="600" fill="url(#grid)" />

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
              className="transition-all duration-300"
            >
              {/* Glow effect when hovered */}
              {isHovered && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={pos.size + 40}
                  fill={color}
                  opacity="0.15"
                  className="animate-pulse"
                />
              )}

              {/* Main bubble circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={pos.size}
                fill={color}
                opacity={isHovered ? 1 : 0.85}
                className="transition-all duration-300 drop-shadow-lg hover:drop-shadow-2xl"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 20px ${color})` : `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))`,
                }}
              />

              {/* Bubble border */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={pos.size}
                fill="none"
                stroke="white"
                strokeWidth="2"
                opacity={isHovered ? 0.5 : 0.2}
                className="transition-all duration-300"
              />

              {/* Commodity symbol - large price label */}
              <text
                x={pos.x}
                y={pos.y - 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="28"
                fontWeight="700"
                fill="white"
                fontFamily="'Monaco', monospace"
                className="transition-all duration-300 select-none"
              >
                ${commodity.currentPrice.toFixed(2)}
              </text>

              {/* Commodity name */}
              <text
                x={pos.x}
                y={pos.y + 25}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16"
                fontWeight="600"
                fill="white"
                className="transition-all duration-300 select-none"
              >
                {commodity.name}
              </text>

              {/* Change percentage */}
              <text
                x={pos.x}
                y={pos.y + 50}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="600"
                fill="white"
                fontFamily="'Monaco', monospace"
                opacity="0.9"
                className="transition-all duration-300 select-none"
              >
                {commodity.change24h > 0 ? '+' : ''}{commodity.change24h.toFixed(2)}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover info card */}
      {hoveredBubble && (
        <div className="absolute bottom-6 left-6 bg-secondary/95 backdrop-blur border border-gray-700/50 rounded-lg p-4 min-w-[240px] pointer-events-none">
          {commodities.find((c) => c.id === hoveredBubble) && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">
                  {commodities.find((c) => c.id === hoveredBubble)?.name}
                </h3>
                <span className="text-2xl">
                  {commodities.find((c) => c.id === hoveredBubble)?.emoji}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price</span>
                  <span className="text-white font-mono">
                    ${commodities.find((c) => c.id === hoveredBubble)?.currentPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">24h Change</span>
                  <span
                    className={`font-mono font-semibold ${
                      (commodities.find((c) => c.id === hoveredBubble)?.change24h ?? 0) > 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {(commodities.find((c) => c.id === hoveredBubble)?.change24h ?? 0) > 0 ? '+' : ''}
                    {commodities.find((c) => c.id === hoveredBubble)?.change24h.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Volatility</span>
                  <span className="text-white font-mono">
                    {commodities.find((c) => c.id === hoveredBubble)?.volatility.toFixed(1)}%
                  </span>
                </div>

                <div className="border-t border-gray-700/50 pt-2 mt-2">
                  <span className="text-gray-400">Sentiment</span>
                  <div className="mt-1">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor:
                          sentimentColors[commodities.find((c) => c.id === hoveredBubble)?.sentiment || 'neutral'] +
                          '26',
                        color: sentimentColors[commodities.find((c) => c.id === hoveredBubble)?.sentiment || 'neutral'],
                      }}
                    >
                      {sentimentLabels[commodities.find((c) => c.id === hoveredBubble)?.sentiment || 'neutral']}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-6 right-6 bg-secondary/80 backdrop-blur border border-gray-700/50 rounded-lg p-3 text-xs space-y-2">
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
