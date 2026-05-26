'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  BUBBLE_PREMIUM,
  TICKER_TYPOGRAPHY,
  MOTION_CINEMATIC,
  SENTIMENT_CINEMATIC,
  getCommodityColor,
  perlinNoisePath,
  distance,
  repulsionForce,
  prefersReducedMotion,
} from '@/lib/cinematic-design-system';

interface CinematicBubbleProps {
  tickerSymbol: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  color: string;
  price: number;
  volatility: number;
  initialX: number;
  initialY: number;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  nearbyBubbles?: Array<{ x: number; y: number; id: string }>;
  focusPoint?: { x: number; y: number } | null;
}

/**
 * CinematicBubble
 * Premium 3D bubble with rim light, specular highlight, breathing, organic drift, and focus fields
 */
export default function CinematicBubble({
  tickerSymbol,
  sentiment,
  color,
  price,
  volatility,
  initialX,
  initialY,
  isSelected = false,
  isHovered = false,
  onClick,
  onHoverStart,
  onHoverEnd,
  nearbyBubbles = [],
  focusPoint = null,
}: CinematicBubbleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Physics state
  const physicsRef = useRef({
    x: initialX,
    y: initialY,
    vx: 0,
    vy: 0,
    phase: Math.random() * Math.PI * 2,
    breathePhase: 0,
    shinePhase: 0,
  });

  // Bubble size (radius) based on volatility
  const radius = 25 + (Math.min(volatility, 25) / 25) * 20;
  const sentimentConfig = SENTIMENT_CINEMATIC[sentiment];
  const glowSize = BUBBLE_PREMIUM.glow.radius[sentiment];

  // Get commodity-specific colors
  const commodity = getCommodityColor(tickerSymbol);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    element.style.opacity = '0';
    element.style.transform = 'scale(0.3) translateY(30px)';

    setTimeout(() => {
      element.style.transition = `all ${MOTION_CINEMATIC.entrance.duration}ms ${MOTION_CINEMATIC.entrance.easing}`;
      element.style.opacity = '1';
      element.style.transform = 'scale(1) translateY(0)';
    }, MOTION_CINEMATIC.entrance.delay);
  }, []);

  // Hover/selection state
  const handleMouseEnter = () => {
    onHoverStart?.();
    if (containerRef.current) {
      const scale = isSelected ? 1.35 : 1.15;
      containerRef.current.style.transform = `translate(${physicsRef.current.x}px, ${physicsRef.current.y}px) scale(${scale})`;
    }
  };

  const handleMouseLeave = () => {
    onHoverEnd?.();
    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${physicsRef.current.x}px, ${physicsRef.current.y}px) scale(1)`;
    }
  };

  const handleClick = () => {
    onClick?.();
  };

  // Animation loop for physics, drift, and breathing
  useEffect(() => {
    let animationFrameId: number;
    const physics = physicsRef.current;

    const animate = () => {
      // Update drift phase
      physics.phase += BUBBLE_PREMIUM.drift.speed.min + Math.random() * 0.00005;

      // Organic Perlin-like drift
      const drift = perlinNoisePath(physics.phase * 100, BUBBLE_PREMIUM.drift.amplitude, {
        x: 0.01,
        y: 0.01,
      });

      // Apply repulsion from nearby bubbles (collision avoidance)
      let repulsion = { x: 0, y: 0 };
      nearbyBubbles.forEach((bubble) => {
        const force = repulsionForce(
          { x: physics.x, y: physics.y },
          { x: bubble.x, y: bubble.y },
          BUBBLE_PREMIUM.focus.radius,
          BUBBLE_PREMIUM.focus.repulsion
        );
        repulsion.x += force.x;
        repulsion.y += force.y;
      });

      // Apply repulsion from focus point (when hovering another bubble)
      if (focusPoint && distance({ x: physics.x, y: physics.y }, focusPoint) < BUBBLE_PREMIUM.focus.radius) {
        const force = repulsionForce(
          { x: physics.x, y: physics.y },
          focusPoint,
          BUBBLE_PREMIUM.focus.radius,
          BUBBLE_PREMIUM.focus.strength
        );
        repulsion.x += force.x * 0.5;
        repulsion.y += force.y * 0.5;
      }

      // Update velocity with drift and repulsion
      physics.vx += drift.x * 0.001 + repulsion.x * 0.01;
      physics.vy += drift.y * 0.001 + repulsion.y * 0.01;

      // Apply inertia/damping
      physics.vx *= BUBBLE_PREMIUM.physics.damping;
      physics.vy *= BUBBLE_PREMIUM.physics.damping;

      // Limit velocity
      const speed = Math.sqrt(physics.vx ** 2 + physics.vy ** 2);
      if (speed > BUBBLE_PREMIUM.physics.maxVelocity) {
        physics.vx = (physics.vx / speed) * BUBBLE_PREMIUM.physics.maxVelocity;
        physics.vy = (physics.vy / speed) * BUBBLE_PREMIUM.physics.maxVelocity;
      }

      // Update position
      physics.x += physics.vx;
      physics.y += physics.vy;

      // Breathing animation (subtle scale pulse)
      physics.breathePhase += BUBBLE_PREMIUM.breathing.frequency;
      const breatheScale = 1 + Math.sin(physics.breathePhase) * BUBBLE_PREMIUM.breathing.amplitude;

      // Specular highlight animation (rotation for metallic sheen)
      physics.shinePhase += 0.01;

      // Update DOM
      if (containerRef.current) {
        const scale = isSelected ? 1.35 * breatheScale : isHovered ? 1.15 * breatheScale : 1 * breatheScale;
        containerRef.current.style.transform = `translate(${physics.x - radius}px, ${physics.y - radius}px) scale(${scale})`;

        // Update glow intensity for selection spotlight
        if (isSelected) {
          const glowElement = containerRef.current.querySelector('[data-glow]') as SVGElement | null;
          if (glowElement) {
            glowElement.style.opacity = String(BUBBLE_PREMIUM.glow.opacity[sentiment] * 1.5);
          }
        }
      }

      // Update specular highlight position
      if (svgRef.current) {
        const specularElement = svgRef.current.querySelector('[data-specular]') as SVGElement | null;
        if (specularElement) {
          const offset = BUBBLE_PREMIUM.specular.offset;
          const angle = physics.shinePhase;
          const newX = radius * 0.5 + Math.cos(angle) * 10;
          const newY = radius * 0.5 + Math.sin(angle) * 10;
          specularElement.setAttribute('cx', String(newX));
          specularElement.setAttribute('cy', String(newY));
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const reducedMotion = prefersReducedMotion();
    if (!reducedMotion) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isSelected, isHovered, nearbyBubbles, focusPoint, sentiment]);

  const svgSize = (radius + glowSize + 20) * 2;
  const svgCenter = svgSize / 2;

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`${tickerSymbol} - ${sentiment} sentiment, $${price.toFixed(2)}`}
      style={{
        position: 'absolute',
        width: svgSize,
        height: svgSize,
        cursor: onClick ? 'pointer' : 'default',
        transform: `translate(${physicsRef.current.x - radius}px, ${physicsRef.current.y - radius}px) scale(1)`,
        transition: prefersReducedMotion() ? 'none' : MOTION_CINEMATIC.hover.easing,
      }}
    >
      <svg
        ref={svgRef}
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        style={{
          display: 'block',
          filter: `drop-shadow(0 8px 20px rgba(0,0,0,0.5))`,
        }}
      >
        <defs>
          {/* Main bubble gradient - NOW COMMODITY-COLORED */}
          <radialGradient id={`gradient-${tickerSymbol}`} cx="40%" cy="40%">
            <stop offset="0%" stopColor={commodity.gradient.center} stopOpacity="1" />
            <stop offset="40%" stopColor={commodity.gradient.center} stopOpacity="0.9" />
            <stop offset="100%" stopColor={commodity.gradient.edge} stopOpacity="0.6" />
          </radialGradient>

          {/* Glow gradient - NOW COMMODITY-COLORED */}
          <radialGradient id={`glow-${tickerSymbol}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={commodity.glow.base} stopOpacity={BUBBLE_PREMIUM.glow.opacity[sentiment]} />
            <stop offset="50%" stopColor={commodity.glow.base} stopOpacity={BUBBLE_PREMIUM.glow.opacity[sentiment] * 0.5} />
            <stop offset="100%" stopColor={commodity.glow.base} stopOpacity="0" />
          </radialGradient>

          {/* Rim light gradient - NOW COMMODITY-COLORED */}
          <radialGradient id={`rimlight-${tickerSymbol}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor={commodity.rimLight} stopOpacity={BUBBLE_PREMIUM.rimLight.opacity} />
            <stop offset="50%" stopColor={commodity.rimLight} stopOpacity={BUBBLE_PREMIUM.rimLight.opacity * 0.5} />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glow layer (sentiment-based size) */}
        <circle
          data-glow
          cx={svgCenter}
          cy={svgCenter}
          r={radius + glowSize}
          fill={`url(#glow-${tickerSymbol})`}
          style={{
            filter: `blur(${BUBBLE_PREMIUM.glow.blur})`,
            opacity: BUBBLE_PREMIUM.glow.opacity[sentiment],
          }}
        />

        {/* Main bubble with 3D radial gradient */}
        <circle
          cx={svgCenter}
          cy={svgCenter}
          r={radius}
          fill={`url(#gradient-${tickerSymbol})`}
          style={{
            filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))`,
          }}
        />

        {/* Rim light (bright ring at edge) */}
        <circle
          cx={svgCenter}
          cy={svgCenter}
          r={radius - 2}
          fill="none"
          stroke={`url(#rimlight-${tickerSymbol})`}
          strokeWidth="2"
          style={{
            opacity: BUBBLE_PREMIUM.rimLight.opacity,
          }}
        />

        {/* Specular highlight (small white dot, metallic shine) */}
        <circle
          data-specular
          cx={svgCenter - radius * 0.3}
          cy={svgCenter - radius * 0.3}
          r={(radius * 12) / 100}
          fill="rgba(255, 255, 255, 0.8)"
          style={{
            filter: `blur(${BUBBLE_PREMIUM.specular.blur})`,
            opacity: isHovered
              ? BUBBLE_PREMIUM.specular.opacity.hover
              : isSelected
                ? BUBBLE_PREMIUM.specular.opacity.active
                : BUBBLE_PREMIUM.specular.opacity.default,
            transition: prefersReducedMotion() ? 'none' : `opacity 300ms ease-out`,
          }}
        />

        {/* Selection border (pulsing for active state) */}
        {isSelected && (
          <circle
            cx={svgCenter}
            cy={svgCenter}
            r={radius + 3}
            fill="none"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="2"
            style={{
              animation: prefersReducedMotion() ? 'none' : `pulse-border 2s cubic-bezier(0.45,0,0.55,1) infinite`,
              opacity: 0.8,
            }}
          />
        )}

        {/* Sentiment emoji */}
        <text
          x={svgCenter}
          y={svgCenter - radius * 0.25}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={`${radius * 0.5}px`}
          style={{
            userSelect: 'none',
            pointerEvents: 'none',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
          }}
        >
          {sentiment === 'bullish' ? '📈' : sentiment === 'bearish' ? '📉' : '➡️'}
        </text>

        {/* Ticker symbol - primary focus */}
        <text
          x={svgCenter}
          y={svgCenter + radius * 0.1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={`${radius * 0.6}px`}
          fontFamily={TICKER_TYPOGRAPHY.family}
          fontWeight={TICKER_TYPOGRAPHY.weight}
          fill={TICKER_TYPOGRAPHY.color}
          letterSpacing={TICKER_TYPOGRAPHY.letterSpacing}
          style={{
            userSelect: 'none',
            pointerEvents: 'none',
            textShadow: TICKER_TYPOGRAPHY.shadow,
            filter: TICKER_TYPOGRAPHY.innerGlow,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {tickerSymbol}
        </text>
      </svg>

      {/* Styles for animations */}
      <style>{`
        @keyframes pulse-border {
          0%, 100% { stroke-width: 2; opacity: 0.6; }
          50% { stroke-width: 3; opacity: 0.9; }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
