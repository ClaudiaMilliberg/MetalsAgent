'use client';

import { useEffect, useRef } from 'react';
import { CommodityType, getTickerColor, type TickerDataFull } from '@/lib/commodity-tickers';

interface Props {
  tickers: TickerDataFull[];
  commodity: CommodityType;
  selectedTicker: TickerDataFull | null;
  onSelectTicker: (ticker: TickerDataFull) => void;
}

export default function ClusterBubbleVisualization({
  tickers,
  commodity,
  selectedTicker,
  onSelectTicker,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Create bubbles from ticker data
    interface Bubble {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      ticker: TickerDataFull;
      rotation: number;
      rotationSpeed: number;
    }

    const bubbles: Bubble[] = tickers.map((ticker, index) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: 25 + (ticker.volatility / 10) * 20,
      ticker,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }));

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

    const animate = () => {
      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0e1a');
      gradient.addColorStop(0.5, '#0f1419');
      gradient.addColorStop(1, '#0a0e1a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw bubbles
      bubbles.forEach((bubble) => {
        // Update position
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Bounce off walls with slight damping
        if (
          bubble.x - bubble.radius < 0 ||
          bubble.x + bubble.radius > canvas.width
        ) {
          bubble.vx *= -0.95;
          bubble.x = Math.max(
            bubble.radius,
            Math.min(canvas.width - bubble.radius, bubble.x)
          );
        }
        if (
          bubble.y - bubble.radius < 0 ||
          bubble.y + bubble.radius > canvas.height
        ) {
          bubble.vy *= -0.95;
          bubble.y = Math.max(
            bubble.radius,
            Math.min(canvas.height - bubble.radius, bubble.y)
          );
        }

        bubble.rotation += bubble.rotationSpeed;

        const isSelected =
          selectedTicker?.ticker.symbol === bubble.ticker.ticker.symbol;
        const scale = isSelected ? 1.4 : 1;
        const actualRadius = bubble.radius * scale;

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

          // Draw glow
          const glowRadius = actualRadius + 15;
          const glowGradient = ctx.createRadialGradient(
            bubble.x,
            bubble.y,
            actualRadius,
            bubble.x,
            bubble.y,
            glowRadius
          );
          glowGradient.addColorStop(0, adjustedColor);
          glowGradient.addColorStop(0.5, adjustedColor + '80');
          glowGradient.addColorStop(1, adjustedColor + '00');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();

          // Draw bubble
          ctx.fillStyle = adjustedColor;
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, actualRadius, 0, Math.PI * 2);
          ctx.fill();

          // Draw border for selected
          if (isSelected) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Draw shadow for selected
            ctx.shadowColor = adjustedColor;
            ctx.shadowBlur = 20;
          }
        }

        // Draw sentiment indicator
        const sentimentEmoji =
          bubble.ticker.sentiment === 'bullish'
            ? '📈'
            : bubble.ticker.sentiment === 'bearish'
              ? '📉'
              : '➡️';

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sentimentEmoji, bubble.x, bubble.y - 8);

        // Draw ticker symbol
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Arial';
        ctx.fillText(bubble.ticker.ticker.symbol, bubble.x, bubble.y + 8);

        // Draw price
        ctx.font = '9px Arial';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(`$${bubble.ticker.price.toFixed(2)}`, bubble.x, bubble.y + 18);

        ctx.shadowBlur = 0;
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
        const distance = Math.sqrt(
          (bubble.x - x) ** 2 + (bubble.y - y) ** 2
        );
        if (distance < bubble.radius + 10) {
          onSelectTicker(bubble.ticker);
          break;
        }
      }
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [tickers, selectedTicker, commodity, onSelectTicker]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded bg-slate-900 cursor-pointer"
    />
  );
}
