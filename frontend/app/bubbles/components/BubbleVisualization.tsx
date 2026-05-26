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

    const glowColor = (glow: string) => {
      switch (glow) {
        case 'orange':
          return 'rgba(249,115,22,0.4)';
        case 'blue':
          return 'rgba(59,130,246,0.4)';
        case 'purple':
          return 'rgba(168,85,247,0.4)';
        case 'white':
          return 'rgba(255,255,255,0.2)';
        default:
          return 'rgba(100,116,139,0.2)';
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

        // Draw glow
        const glowRadius = actualRadius + 10;
        const gradient = ctx.createRadialGradient(bubble.x, bubble.y, actualRadius, bubble.x, bubble.y, glowRadius);
        gradient.addColorStop(0, glowColor(bubble.commodity.glow));
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw bubble
        ctx.fillStyle = sentimentColor(bubble.commodity.sentiment);
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, actualRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw border for selected
        if (isSelected) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Draw commodity name
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bubble.commodity.name, bubble.x, bubble.y - 5);

        // Draw price
        ctx.font = '10px Arial';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(`$${bubble.commodity.price.toFixed(0)}`, bubble.x, bubble.y + 8);
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
