'use client';

import React, { useEffect, useState } from 'react';
import CommodityIcon from '@/components/CommodityIcon';
import { GLASS_LAYERS, DETAIL_CARD_CINEMATIC, SENTIMENT_CINEMATIC, TICKER_TYPOGRAPHY, getCommodityColor, prefersReducedMotion } from '@/lib/cinematic-design-system';

interface TickerData {
  ticker: {
    symbol: string;
    name: string;
    type: string;
    sector: string;
    description: string;
  };
  price: number;
  change24h: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number;
  volatility: number;
  volume: number;
  marketCap?: number;
  signals: {
    reddit: number;
    news: number;
    twitter: number;
    onchain: number;
  };
  headlines: string[];
}

interface CinematicDetailCardProps {
  ticker: TickerData;
  isOpen?: boolean;
}

/**
 * CinematicDetailCard
 * Multi-layer glassmorphism with glow ring, sentiment dial, and micro-animations
 */
export default function CinematicDetailCard({ ticker, isOpen = true }: CinematicDetailCardProps) {
  const [animateMetrics, setAnimateMetrics] = useState(false);
  const [animateDial, setAnimateDial] = useState(false);

  useEffect(() => {
    if (isOpen && !prefersReducedMotion()) {
      const metricsTimer = setTimeout(() => setAnimateMetrics(true), 100);
      const dialTimer = setTimeout(() => setAnimateDial(true), 200);

      return () => {
        clearTimeout(metricsTimer);
        clearTimeout(dialTimer);
      };
    }
  }, [isOpen]);

  const sentimentConfig = SENTIMENT_CINEMATIC[ticker.sentiment];
  const commodity = getCommodityColor(ticker.ticker.symbol);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (ticker.sentimentScore / 100) * circumference;

  const handleExit = () => {
    setAnimateMetrics(false);
    setAnimateDial(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        background: GLASS_LAYERS.base.background,
        backdropFilter: `blur(${GLASS_LAYERS.base.blur})`,
        border: GLASS_LAYERS.base.border,
        boxShadow: GLASS_LAYERS.base.shadow,
        borderRadius: '16px',
        padding: '24px',
        overflow: 'hidden',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
        transition: prefersReducedMotion()
          ? 'none'
          : `all ${DETAIL_CARD_CINEMATIC.entry.duration}ms ${DETAIL_CARD_CINEMATIC.entry.easing}`,
      }}
    >
      {/* Inner highlight layer */}
      <div
        style={{
          position: 'absolute',
          top: '1px',
          left: '1px',
          right: '1px',
          height: '1px',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05), transparent)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
        }}
      />

      {/* Rim light glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: 'radial-gradient(ellipse at top left, rgba(100, 200, 255, 0.1), transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header with commodity icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <CommodityIcon symbol={ticker.ticker.symbol} size={36} showGlow={true} />
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 8px 0',
                letterSpacing: '-0.02em',
                fontFamily: TICKER_TYPOGRAPHY.family,
              }}
            >
              {ticker.ticker.symbol}
            </h2>
            <p
              style={{
                fontSize: '12px',
                color: '#94a3b8',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {ticker.ticker.name}
            </p>
          </div>
        </div>

        {/* Price section with micro-animation */}
        <div
          style={{
            marginBottom: '24px',
            opacity: animateMetrics ? 1 : 0,
            transform: animateMetrics ? 'translateY(0)' : 'translateY(8px)',
            transition: prefersReducedMotion()
              ? 'none'
              : `all ${DETAIL_CARD_CINEMATIC.metricStagger.duration}ms ease-out`,
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: '#cbd5e1',
              margin: '0 0 4px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Current Price
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <p
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              ${ticker.price.toFixed(2)}
            </p>
            <p
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: ticker.change24h >= 0 ? '#10b981' : '#ef4444',
                margin: 0,
              }}
            >
              {ticker.change24h >= 0 ? '+' : ''}
              {ticker.change24h.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Sentiment Dial Section */}
        <div
          style={{
            marginBottom: '24px',
            paddingBottom: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: '#cbd5e1',
              margin: '0 0 12px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Sentiment Analysis
          </p>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {/* Circular Sentiment Dial */}
            <div
              style={{
                position: 'relative',
                width: '120px',
                height: '120px',
                flexShrink: 0,
              }}
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                style={{
                  transform: 'rotate(-90deg)',
                  filter: `drop-shadow(0 0 20px ${commodity.glow.base})`,
                }}
              >
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
                  stroke={sentimentConfig.primary}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={animateDial ? strokeDashoffset : circumference}
                  strokeLinecap="round"
                  style={{
                    transition: prefersReducedMotion()
                      ? 'none'
                      : `stroke-dashoffset ${DETAIL_CARD_CINEMATIC.dial.duration}ms ${DETAIL_CARD_CINEMATIC.dial.easing}`,
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
                <p
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: '0 0 2px 0',
                  }}
                >
                  {ticker.sentimentScore.toFixed(0)}
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    margin: 0,
                  }}
                >
                  /100
                </p>
              </div>
            </div>

            {/* Sentiment Label */}
            <div>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: sentimentConfig.primary,
                  margin: '0 0 8px 0',
                  textTransform: 'capitalize',
                }}
              >
                {ticker.sentiment}
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: '#cbd5e1',
                  margin: 0,
                  lineHeight: '1.5',
                }}
              >
                {ticker.sentiment === 'bullish'
                  ? 'Strong positive sentiment'
                  : ticker.sentiment === 'bearish'
                    ? 'Caution indicated'
                    : 'Mixed sentiment'}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          {[
            {
              label: 'Volatility',
              value: `${ticker.volatility.toFixed(1)}%`,
              delay: 100,
            },
            {
              label: 'Volume',
              value: ticker.volume > 1000000 ? `${(ticker.volume / 1000000).toFixed(1)}M` : `${(ticker.volume / 1000).toFixed(0)}K`,
              delay: 150,
            },
            {
              label: 'Market Cap',
              value: ticker.marketCap ? `$${(ticker.marketCap / 1000000000).toFixed(1)}B` : 'N/A',
              delay: 200,
            },
            {
              label: 'Type',
              value: ticker.ticker.type,
              delay: 250,
            },
          ].map((metric) => (
            <div
              key={metric.label}
              style={{
                backgroundColor: 'rgba(71, 85, 105, 0.2)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                opacity: animateMetrics ? 1 : 0,
                transform: animateMetrics ? 'translateY(0)' : 'translateY(8px)',
                transition: prefersReducedMotion()
                  ? 'none'
                  : `all ${DETAIL_CARD_CINEMATIC.metricStagger.duration}ms ease-out ${metric.delay}ms`,
              }}
            >
              <p
                style={{
                  fontSize: '10px',
                  color: '#94a3b8',
                  margin: '0 0 4px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {metric.label}
              </p>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        {/* Signal Breakdown */}
        <div
          style={{
            marginBottom: '24px',
            paddingBottom: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: '#cbd5e1',
              margin: '0 0 12px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Signal Sources
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: '🔴 Reddit', value: ticker.signals.reddit, color: '#ea580c' },
              { label: '📰 News', value: ticker.signals.news, color: '#f1f5f9' },
              { label: '𝕏 Twitter', value: ticker.signals.twitter, color: '#3b82f6' },
              { label: '⛓️ On-chain', value: ticker.signals.onchain, color: '#a855f7' },
            ].map((signal, idx) => (
              <div
                key={signal.label}
                style={{
                  opacity: animateMetrics ? 1 : 0,
                  transform: animateMetrics ? 'translateY(0)' : 'translateY(8px)',
                  transition: prefersReducedMotion()
                    ? 'none'
                    : `all ${DETAIL_CARD_CINEMATIC.metricStagger.duration}ms ease-out ${DETAIL_CARD_CINEMATIC.metricStagger.delay + idx * 50}ms`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#cbd5e1',
                    }}
                  >
                    {signal.label}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#ffffff',
                    }}
                  >
                    {signal.value}%
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    backgroundColor: 'rgba(71, 85, 105, 0.3)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: signal.color,
                      width: `${signal.value}%`,
                      transition: prefersReducedMotion() ? 'none' : `width 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${DETAIL_CARD_CINEMATIC.signalBar.stagger * idx}ms`,
                      borderRadius: '3px',
                      boxShadow: `0 0 12px ${signal.color}40`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            backgroundColor: 'rgba(71, 85, 105, 0.15)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            opacity: animateMetrics ? 1 : 0,
            transform: animateMetrics ? 'translateY(0)' : 'translateY(8px)',
            transition: prefersReducedMotion()
              ? 'none'
              : `all ${DETAIL_CARD_CINEMATIC.metricStagger.duration}ms ease-out 300ms`,
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: '#cbd5e1',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            {ticker.ticker.description}
          </p>
        </div>
      </div>
    </div>
  );
}
