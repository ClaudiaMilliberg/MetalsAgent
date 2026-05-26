'use client';

import React, { useEffect, useRef } from 'react';
import { BUBBLE, TYPOGRAPHY, SENTIMENT, MOTION, A11Y } from '@/lib/design-system';

interface BubbleIndicatorProps {
  tickerSymbol: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  price: number;
  volatility: number;
  size?: 'sm' | 'md' | 'lg';
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  showPrice?: boolean;
  showSentiment?: boolean;
}

/**
 * BubbleIndicator - Premium SVG-based bubble component
 * Displays ticker symbol prominently with sentiment feedback
 * Can be used standalone or within canvas-based bubble systems
 */
export default function BubbleIndicator({
  tickerSymbol,
  sentiment,
  price,
  volatility,
  size = 'md',
  isSelected = false,
  isHovered = false,
  onClick,
  onHoverStart,
  onHoverEnd,
  showPrice = false,
  showSentiment = true,
}: BubbleIndicatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate bubble radius based on size and volatility
  const sizeMap = { sm: 25, md: 35, lg: 45 };
  const baseRadius = sizeMap[size];
  const volatilityAdjustment = (Math.min(volatility, 25) / 10) * BUBBLE.size.volatilityFactor;
  const radius = baseRadius + (volatilityAdjustment * 0.5); // 0.5 to moderate effect

  // Get glow radius based on sentiment
  const glowRadius = BUBBLE.glow[sentiment];
  const sentimentData = SENTIMENT[sentiment];

  // Animate on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';

    // Trigger animation
    setTimeout(() => {
      element.style.transition = `all ${MOTION.duration.normal}ms ${MOTION.easing.spring}`;
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    }, 10);
  }, []);

  // Handle hover state transitions
  const handleMouseEnter = () => {
    onHoverStart?.();
    if (containerRef.current) {
      containerRef.current.style.transform = isSelected ? 'scale(1.3)' : 'scale(1.15)';
    }
  };

  const handleMouseLeave = () => {
    onHoverEnd?.();
    if (containerRef.current) {
      containerRef.current.style.transform = isSelected ? 'scale(1.3)' : 'scale(1)';
    }
  };

  const svgSize = radius * 2.5; // Container size with padding for glow
  const svgCenter = svgSize / 2;

  // Text sizing based on bubble size
  const textSizeMap = {
    sm: TYPOGRAPHY.ticker.size.sm,
    md: TYPOGRAPHY.ticker.size.md,
    lg: TYPOGRAPHY.ticker.size.lg,
  };
  const fontSize = textSizeMap[size];

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`${tickerSymbol} - ${sentiment} sentiment, $${price.toFixed(2)}`}
      style={{
        position: 'relative',
        width: svgSize,
        height: svgSize,
        cursor: onClick ? 'pointer' : 'default',
        opacity: 1,
        transform: isSelected ? 'scale(1.3)' : 'scale(1)',
        transition: `transform ${MOTION.duration.normal}ms ${MOTION.easing.smooth}`,
      }}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        style={{ display: 'block' }}
      >
        <defs>
          {/* Glow gradient */}
          <radialGradient id={`glow-${tickerSymbol}`} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={sentimentData.color} stopOpacity={isSelected ? 0.6 : 0.3} />
            <stop offset="50%" stopColor={sentimentData.color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={sentimentData.color} stopOpacity="0" />
          </radialGradient>

          {/* Rim light gradient */}
          <radialGradient id={`rim-${tickerSymbol}`} cx="35%" cy="35%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" stopOpacity="0" />
          </radialGradient>

          {/* Main color gradient */}
          <radialGradient id={`main-${tickerSymbol}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={sentimentData.color} stopOpacity="1" />
            <stop offset="100%" stopColor={sentimentData.color} stopOpacity="0.9" />
          </radialGradient>
        </defs>

        {/* Glow layer (sentiment-based size) */}
        <circle
          cx={svgCenter}
          cy={svgCenter}
          r={radius + glowRadius}
          fill={`url(#glow-${tickerSymbol})`}
          style={{
            filter: `drop-shadow(0 0 ${glowRadius}px ${sentimentData.color}40)`,
          }}
        />

        {/* Main bubble */}
        <circle
          cx={svgCenter}
          cy={svgCenter}
          r={radius}
          fill={`url(#main-${tickerSymbol})`}
          style={{
            filter: `drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))`,
            transition: `r ${MOTION.duration.quick}ms ${MOTION.easing.smooth}`,
          }}
        />

        {/* Rim light highlight */}
        <circle
          cx={svgCenter - radius * 0.3}
          cy={svgCenter - radius * 0.3}
          r={radius * 0.6}
          fill={`url(#rim-${tickerSymbol})`}
        />

        {/* Border for selected state */}
        {isSelected && (
          <circle
            cx={svgCenter}
            cy={svgCenter}
            r={radius + 2}
            fill="none"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="3"
            style={{
              animation: `pulse 2s ${MOTION.easing.smooth} infinite`,
            }}
          />
        )}

        {/* Sentiment emoji */}
        {showSentiment && (
          <text
            x={svgCenter}
            y={svgCenter - radius * 0.25}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={`${radius * 0.6}px`}
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          >
            {sentiment === 'bullish' ? '📈' : sentiment === 'bearish' ? '📉' : '➡️'}
          </text>
        )}

        {/* Ticker symbol - primary focus */}
        <text
          x={svgCenter}
          y={svgCenter + radius * 0.15}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontFamily={TYPOGRAPHY.ticker.family}
          fontWeight={TYPOGRAPHY.ticker.weight}
          fill="#ffffff"
          letterSpacing={TYPOGRAPHY.ticker.letterSpacing}
          style={{
            userSelect: 'none',
            pointerEvents: 'none',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {tickerSymbol}
        </text>

        {/* Price label (optional) */}
        {showPrice && (
          <text
            x={svgCenter}
            y={svgCenter + radius * 0.6}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={`${radius * 0.25}px`}
            fontFamily={TYPOGRAPHY.body.family}
            fontWeight={400}
            fill="#e2e8f0"
            style={{
              userSelect: 'none',
              pointerEvents: 'none',
              opacity: 0.8,
            }}
          >
            ${price.toFixed(1)}
          </text>
        )}
      </svg>

      {/* Pulse animation for selected state */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            stroke-opacity: 0.6;
          }
          50% {
            stroke-opacity: 0.3;
          }
        }

        ${A11Y.prefersReducedMotion} {
          & {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
