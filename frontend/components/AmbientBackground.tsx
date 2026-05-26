'use client';

import React, { useEffect, useRef } from 'react';
import { A11Y } from '@/lib/design-system';

interface OrbConfig {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
  drift: number;
}

/**
 * AmbientBackground - Floating orbs and atmospheric effects
 * Creates a cinematic, living background for the commodity dashboard
 */
export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<OrbConfig[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize floating orbs
    const orbColors = [
      { color: 'rgba(16, 185, 129, 0.1)', radius: 80 },   // Emerald
      { color: 'rgba(239, 68, 68, 0.08)', radius: 120 },  // Red
      { color: 'rgba(59, 130, 246, 0.08)', radius: 100 }, // Blue
    ];

    orbsRef.current = orbColors.map((config, i) => ({
      x: (canvas.width / orbColors.length) * i + Math.random() * 100,
      y: canvas.height * 0.3 + Math.random() * 200,
      radius: config.radius,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      color: config.color,
      opacity: config.color.includes('0.08') ? 0.08 : 0.1,
      drift: Math.random() * 0.02 + 0.01,
    }));

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Animation loop
    const animate = () => {
      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0e1a');
      gradient.addColorStop(0.5, '#0f1419');
      gradient.addColorStop(1, '#050608');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw orbs
      orbsRef.current.forEach((orb) => {
        // Update position with organic drift
        orb.x += orb.vx;
        orb.y += orb.vy;
        orb.vy += orb.drift * 0.01; // Slight downward drift

        // Wrap around screen
        if (orb.x - orb.radius > canvas.width) orb.x = -orb.radius;
        if (orb.x + orb.radius < 0) orb.x = canvas.width + orb.radius;
        if (orb.y - orb.radius > canvas.height) orb.y = -orb.radius;
        if (orb.y + orb.radius < 0) orb.y = canvas.height + orb.radius;

        // Draw blurred orb with radial gradient
        const orbGradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );

        const colorMatch = orb.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
        if (colorMatch) {
          const [, r, g, b] = colorMatch;
          orbGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${orb.opacity})`);
          orbGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${orb.opacity * 0.5})`);
          orbGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        }

        ctx.fillStyle = orbGradient;
        ctx.fillRect(orb.x - orb.radius, orb.y - orb.radius, orb.radius * 2, orb.radius * 2);

        // Optional: Draw soft blur filter
        ctx.filter = 'blur(60px)';
        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = 'none';
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
