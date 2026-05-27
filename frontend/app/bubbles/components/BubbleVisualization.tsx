'use client';

import { useEffect, useRef } from 'react';

interface Commodity {
  id: string;
  name: string;
  price: number;
  change24h: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  volatility: number;
  glow: 'orange' | 'blue' | 'white' | 'purple';
  signalBreakdown: {
    reddit: number;
    news: number;
    twitter: number;
    onchain: number;
  };
  headlines: string[];
  demand: string;
  confidence: number;
  lastUpdated: string;
}

interface Props {
  commodities: Commodity[];
  selectedCommodity: Commodity | null;
  onSelect: (commodity: Commodity) => void;
}

export default function BubbleVisualization({ commodities, selectedCommodity, onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Bubble particles
    interface Bubble {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      commodity: Commodity;
      rotation: number;
      rotationSpeed: number;
    }

    const bubbles: Bubble[] = commodities.map((commodity, index) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 20 + (commodity.volatility / 10) * 15,
      commodity,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
    }));

    const sentimentColor = (sentiment: string) => {
      switch (sentiment) {
        case 'bullish':
          return '#22c55e';
        case 'bearish':
          return '#ef4444';
        case 'neutral':
          return '#f59e0b';
        default:
          return '#64748b';
      }
    };

    const glowColor = (glow: string, intensity: number = 1) => {
      const alpha = 0.4 * intensity;
      switch (glow) {
        case 'orange':
          return `rgba(249,115,22,${alpha})`;
        case 'blue':
          return `rgba(59,130,246,${alpha})`;
        case 'purple':
          return `rgba(168,85,247,${alpha})`;
        case 'white':
          return `rgba(255,255,255,${0.2 * intensity})`;
        case 'yellow':
          return `rgba(234,179,8,${alpha})`;
        case 'cyan':
          return `rgba(6,182,212,${alpha})`;
        default:
          return `rgba(100,116,139,${0.2 * intensity})`;
      }
    };

    const getNeonColor = (glow: string) => {
      switch (glow) {
        case 'orange':
          return '#f97316';
        case 'blue':
          return '#3b82f6';
        case 'purple':
          return '#a855f7';
        case 'white':
          return '#f0f9ff';
        case 'yellow':
          return '#eab308';
        case 'cyan':
          return '#06b6d4';
        default:
          return '#64748b';
      }
    };

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw bubbles
      bubbles.forEach((bubble) => {
        // Update position
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Bounce off walls
        if (bubble.x - bubble.radius < 0 || bubble.x + bubble.radius > canvas.width) {
          bubble.vx *= -1;
          bubble.x = Math.max(bubble.radius, Math.min(canvas.width - bubble.radius, bubble.x));
        }
        if (bubble.y - bubble.radius < 0 || bubble.y + bubble.radius > canvas.height) {
          bubble.vy *= -1;
          bubble.y = Math.max(bubble.radius, Math.min(canvas.height - bubble.radius, bubble.y));
        }

        bubble.rotation += bubble.rotationSpeed;

        const isSelected = selectedCommodity?.id === bubble.commodity.id;
        const scale = isSelected ? 1.3 : 1;
        const actualRadius = bubble.radius * scale;
        const glowIntensity = isSelected ? 2 : 1;

        // 7-LAYER GLOW EFFECT
        // Layer 1-3: Outer soft glow bloom
        for (let i = 3; i >= 1; i--) {
          const bloomRadius = actualRadius + 30 * i;
          const bloomGradient = ctx.createRadialGradient(bubble.x, bubble.y, actualRadius + 20 * (i - 1), bubble.x, bubble.y, bloomRadius);
          bloomGradient.addColorStop(0, glowColor(bubble.commodity.glow, glowIntensity * (0.3 / i)));
          bloomGradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = bloomGradient;
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bloomRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Layer 4: Mid glow halo
        const midGlowRadius = actualRadius + 15;
        const midGradient = ctx.createRadialGradient(bubble.x, bubble.y, actualRadius, bubble.x, bubble.y, midGlowRadius);
        midGradient.addColorStop(0, glowColor(bubble.commodity.glow, glowIntensity * 0.6));
        midGradient.addColorStop(1, glowColor(bubble.commodity.glow, 0.1));
        ctx.fillStyle = midGradient;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, midGlowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Layer 5: Core bubble with sentiment color
        ctx.fillStyle = sentimentColor(bubble.commodity.sentiment);
        ctx.shadowColor = glowColor(bubble.commodity.glow, glowIntensity);
        ctx.shadowBlur = isSelected ? 25 : 15;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, actualRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Layer 6: Inner highlight (white core glow)
        const highlightGradient = ctx.createRadialGradient(
          bubble.x - actualRadius * 0.3,
          bubble.y - actualRadius * 0.3,
          0,
          bubble.x,
          bubble.y,
          actualRadius
        );
        highlightGradient.addColorStop(0, 'rgba(255,255,255,0.3)');
        highlightGradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, actualRadius, 0, Math.PI * 2);
        ctx.fill();

        // Layer 7: Selected state glow ring
        if (isSelected) {
          ctx.strokeStyle = getNeonColor(bubble.commodity.glow);
          ctx.lineWidth = 4;
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, actualRadius + 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Draw commodity name (bold, larger)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bubble.commodity.name.toUpperCase(), bubble.x, bubble.y - 6);

        // Draw price (monospace, larger)
        ctx.font = 'bold 12px JetBrains Mono, monospace';
        ctx.fillStyle = getNeonColor(bubble.commodity.glow);
        ctx.fillText(`$${bubble.commodity.price.toFixed(2)}`, bubble.x, bubble.y + 8);
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
        const distance = Math.sqrt((bubble.x - x) ** 2 + (bubble.y - y) ** 2);
        if (distance < bubble.radius + 10) {
          onSelect(bubble.commodity);
          break;
        }
      }
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [commodities, selectedCommodity, onSelect]);

  return <canvas ref={canvasRef} className="w-full h-full rounded bg-slate-900" />;
}
