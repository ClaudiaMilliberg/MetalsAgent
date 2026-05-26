'use client';

import { useEffect, useRef } from 'react';
import { CommodityType, getTickerColor, type TickerDataFull } from '@/lib/commodity-tickers';

interface Props {
  tickers: TickerDataFull[];
  commodity: CommodityType;
  selectedTicker: TickerDataFull | null;
  onSelectTicker: (ticker: TickerDataFull) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface Bubble {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  radius: number;
  ticker: TickerDataFull;
  rotation: number;
  rotationSpeed: number;
  life: number; // 0-1, animation lifecycle
  idlePhase: number; // For sine-wave float
  hoverAlpha: number; // For smooth hover transition
}

export default function ClusterBubbleVisualization({
  tickers,
  commodity,
  selectedTicker,
  onSelectTicker,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Create bubbles from ticker data with entrance animation
    const bubbles: Bubble[] = tickers.map((ticker, index) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const angle = (index / tickers.length) * Math.PI * 2;
      const distance = 80;

      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        targetX: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
        targetY: Math.random() * canvas.height * 0.8 + canvas.height * 0.1,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: 25 + (ticker.volatility / 10) * 20,
        ticker,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        life: 0, // Start invisible, animate in
        idlePhase: Math.random() * Math.PI * 2,
        hoverAlpha: 0,
      };
    });

    // Particle system helper
    const createDustParticle = (x: number, y: number) => {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.2,
        life: 1,
        maxLife: Math.random() * 1200 + 800,
        size: Math.random() * 1.5 + 0.5,
      });
    };

    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life = Math.max(0, p.life - 1000 / 60); // Assuming 60fps
        p.vy -= 0.05; // Slight upward drift
        return p.life > 0;
      });
    };

    const drawParticles = () => {
      particlesRef.current.forEach((p) => {
        const alpha = (p.life / p.maxLife) * 0.15;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const sentimentColor = (sentiment: string) => {
      switch (sentiment) {
        case 'bullish':
          return 1; // Increase brightness
        case 'bearish':
          return -1; // Decrease brightness
        case 'neutral':
          return 0; // No change
        default:
          return 0;
      }
    };

    // Get glow radius based on sentiment (primary visual signal)
    const getGlowRadius = (sentiment: string, baseRadius: number): number => {
      switch (sentiment) {
        case 'bullish':
          return baseRadius + 24;
        case 'bearish':
          return baseRadius + 6;
        case 'neutral':
          return baseRadius + 14;
        default:
          return baseRadius + 14;
      }
    };

    const animate = () => {
      frameCountRef.current++;

      // Draw radial gradient background (depth effect)
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );
      bgGradient.addColorStop(0, '#0f1419');
      bgGradient.addColorStop(1, '#050608');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Update particles
      updateParticles();

      // Emit new particles occasionally
      if (frameCountRef.current % 4 === 0) {
        bubbles.forEach((bubble) => {
          if (bubble.life > 0.3) {
            createDustParticle(bubble.x, bubble.y);
          }
        });
      }

      // Draw particles
      drawParticles();

      // Draw bubbles
      bubbles.forEach((bubble, index) => {
        // Entrance animation (first 50 frames, staggered)
        const staggerDelay = index * 2;
        if (staggerDelay < frameCountRef.current) {
          const entranceFrame = frameCountRef.current - staggerDelay;
          const entranceProgress = Math.min(1, entranceFrame / 40); // 40-frame entrance
          bubble.life = entranceProgress;

          // Elastic bounce easing for entrance
          const easeProgress =
            entranceProgress < 0.5
              ? 2 * entranceProgress * entranceProgress
              : 1 - Math.pow(-2 * entranceProgress + 2, 2) / 2;

          bubble.x = bubble.x * (1 - easeProgress) + bubble.targetX * easeProgress;
          bubble.y = bubble.y * (1 - easeProgress) + bubble.targetY * easeProgress;
        }

        // Idle float motion (sine-wave)
        const floatAmplitude = 8;
        const floatFrequency = 0.015;
        bubble.idlePhase += floatFrequency;

        const floatOffsetX = Math.sin(bubble.idlePhase) * floatAmplitude;
        const floatOffsetY = Math.cos(bubble.idlePhase * 0.7) * floatAmplitude;

        const displayX = bubble.x + floatOffsetX;
        const displayY = bubble.y + floatOffsetY;

        // Natural velocity drift
        bubble.vx += (Math.random() - 0.5) * 0.1;
        bubble.vy += (Math.random() - 0.5) * 0.1;
        bubble.vx *= 0.98;
        bubble.vy *= 0.98;

        bubble.x += bubble.vx * 0.3;
        bubble.y += bubble.vy * 0.3;

        // Bounce off walls with slight damping
        if (
          bubble.x - bubble.radius < 0 ||
          bubble.x + bubble.radius > canvas.width
        ) {
          bubble.vx *= -0.85;
          bubble.x = Math.max(
            bubble.radius,
            Math.min(canvas.width - bubble.radius, bubble.x)
          );
        }
        if (
          bubble.y - bubble.radius < 0 ||
          bubble.y + bubble.radius > canvas.height
        ) {
          bubble.vy *= -0.85;
          bubble.y = Math.max(
            bubble.radius,
            Math.min(canvas.height - bubble.radius, bubble.y)
          );
        }

        bubble.rotation += bubble.rotationSpeed;

        // Check if selected or hovered
        const isSelected =
          selectedTicker?.ticker.symbol === bubble.ticker.ticker.symbol;
        const targetHoverAlpha = isSelected ? 1 : 0;
        bubble.hoverAlpha += (targetHoverAlpha - bubble.hoverAlpha) * 0.15;

        // Scale based on state
        let scale = 1;
        if (isSelected) {
          scale = 1.3 + Math.sin(frameCountRef.current * 0.05) * 0.05;
        }
        const actualRadius = bubble.radius * scale * bubble.life;

        // Get base color for ticker
        const baseColor = getTickerColor(
          bubble.ticker.commodity,
          bubble.ticker.ticker.colorOffset
        );

        // Apply sentiment modifier
        const sentimentMod = sentimentColor(bubble.ticker.sentiment);

        // Parse HSL color and adjust based on sentiment
        const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (hslMatch) {
          const h = parseInt(hslMatch[1]);
          const s = parseInt(hslMatch[2]);
          let l = parseInt(hslMatch[3]);

          // Adjust lightness based on sentiment
          l = Math.max(30, Math.min(70, l + sentimentMod * 15));

          const adjustedColor = `hsl(${h}, ${s}%, ${l}%)`;

          // Draw dynamic glow based on sentiment
          const glowRadius = getGlowRadius(bubble.ticker.sentiment, actualRadius);
          const glowGradient = ctx.createRadialGradient(
            displayX,
            displayY,
            actualRadius,
            displayX,
            displayY,
            glowRadius
          );

          const glowOpacity = isSelected ? 0.6 : 0.3;
          glowGradient.addColorStop(0, adjustedColor);
          glowGradient.addColorStop(0.5, adjustedColor + Math.floor(glowOpacity * 128).toString(16).padStart(2, '0'));
          glowGradient.addColorStop(1, adjustedColor + '00');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(displayX, displayY, glowRadius, 0, Math.PI * 2);
          ctx.fill();

          // Draw rim-light highlight (top-left, 45°)
          const rimLightGradient = ctx.createRadialGradient(
            displayX - actualRadius * 0.4,
            displayY - actualRadius * 0.4,
            0,
            displayX,
            displayY,
            actualRadius * 1.5
          );
          rimLightGradient.addColorStop(0, `rgba(255, 255, 255, ${0.3 * bubble.life})`);
          rimLightGradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.1 * bubble.life})`);
          rimLightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = rimLightGradient;
          ctx.beginPath();
          ctx.arc(displayX, displayY, actualRadius * 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Draw main bubble
          ctx.fillStyle = adjustedColor;
          ctx.globalAlpha = bubble.life;
          ctx.beginPath();
          ctx.arc(displayX, displayY, actualRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;

          // Draw border for selected
          if (isSelected) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * bubble.life})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(displayX, displayY, actualRadius + 2, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.shadowBlur = 0;
        }

        // Draw sentiment indicator
        const sentimentEmoji =
          bubble.ticker.sentiment === 'bullish'
            ? '📈'
            : bubble.ticker.sentiment === 'bearish'
              ? '📉'
              : '➡️';

        ctx.globalAlpha = bubble.life;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sentimentEmoji, displayX, displayY - actualRadius * 0.3);

        // Draw ticker symbol
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Arial';
        ctx.fillText(bubble.ticker.ticker.symbol, displayX, displayY + actualRadius * 0.1);

        // Draw price
        ctx.font = '9px Arial';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(`$${bubble.ticker.price.toFixed(2)}`, displayX, displayY + actualRadius * 0.5);
        ctx.globalAlpha = 1;
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle clicks
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (const bubble of bubbles) {
        const floatOffsetX = Math.sin(bubble.idlePhase) * 8;
        const floatOffsetY = Math.cos(bubble.idlePhase * 0.7) * 8;
        const displayX = bubble.x + floatOffsetX;
        const displayY = bubble.y + floatOffsetY;
        const actualRadius = bubble.radius * (selectedTicker?.ticker.symbol === bubble.ticker.ticker.symbol ? 1.3 : 1) * bubble.life;

        const distance = Math.sqrt((displayX - x) ** 2 + (displayY - y) ** 2);
        if (distance < actualRadius + 15) {
          onSelectTicker(bubble.ticker);
          break;
        }
      }
    };

    canvas.addEventListener('click', handleClick);
    return () => {
      canvas.removeEventListener('click', handleClick);
      particlesRef.current = [];
      frameCountRef.current = 0;
    };
  }, [tickers, selectedTicker, commodity, onSelectTicker]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded bg-slate-900 cursor-pointer"
    />
  );
}
