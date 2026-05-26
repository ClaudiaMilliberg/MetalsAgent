'use client';

import React, { useEffect, useRef } from 'react';
import { CINEMATIC, vignette } from '@/lib/cinematic-design-system';

interface Orb {
  x: number;
  y: number;
  radius: number;
  color: string;
  phase: number;
  speed: number;
  amplitude: number;
  frequency: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
}

/**
 * CinematicBackground
 * Obsidian gradient + floating orbs + noise + grid + dust particles + vignette
 */
export default function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const noiseTextureRef = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize orbs
    const orbsConfig = [
      { color: CINEMATIC.orbs.colors[0], radius: CINEMATIC.orbs.radii[0], speed: CINEMATIC.orbs.speeds[0] },
      { color: CINEMATIC.orbs.colors[1], radius: CINEMATIC.orbs.radii[1], speed: CINEMATIC.orbs.speeds[1] },
      { color: CINEMATIC.orbs.colors[2], radius: CINEMATIC.orbs.radii[2], speed: CINEMATIC.orbs.speeds[2] },
      { color: CINEMATIC.orbs.colors[3], radius: CINEMATIC.orbs.radii[3], speed: CINEMATIC.orbs.speeds[3] },
    ];

    orbsRef.current = orbsConfig.map((config, i) => ({
      x: (canvas.width / 4) * (i + 1),
      y: canvas.height * 0.3 + Math.random() * 200,
      radius: config.radius,
      color: config.color,
      phase: Math.random() * Math.PI * 2,
      speed: config.speed,
      amplitude: CINEMATIC.orbs.drift.amplitude,
      frequency: CINEMATIC.orbs.drift.frequency,
    }));

    // Generate noise texture (once)
    const generateNoiseTexture = (w: number, h: number): ImageData => {
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = noise;
        data[i + 1] = noise;
        data[i + 2] = noise;
        data[i + 3] = 255;
      }

      return imageData;
    };

    noiseTextureRef.current = generateNoiseTexture(200, 200);

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Emit particles occasionally
    const emitParticle = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = CINEMATIC.dust.size.min + Math.random() * (CINEMATIC.dust.size.max - CINEMATIC.dust.size.min);
      const lifetime = CINEMATIC.dust.lifetime.min + Math.random() * (CINEMATIC.dust.lifetime.max - CINEMATIC.dust.lifetime.min);

      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * CINEMATIC.dust.velocity.x,
        vy: CINEMATIC.dust.velocity.y,
        life: lifetime,
        maxLife: lifetime,
        size,
        opacity: CINEMATIC.dust.opacity,
      });
    };

    // Animation loop
    let frameCount = 0;
    const animate = () => {
      timeRef.current += 1;

      // Draw background gradient
      const gradientX = canvas.width / 2;
      const gradientY = canvas.height / 2;
      const maxDist = Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2;

      const bgGradient = ctx.createRadialGradient(
        gradientX,
        gradientY,
        0,
        gradientX,
        gradientY,
        maxDist
      );
      bgGradient.addColorStop(0, '#0f1419');
      bgGradient.addColorStop(0.4, '#0a0e1a');
      bgGradient.addColorStop(1, '#050608');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw faint grid
      ctx.strokeStyle = CINEMATIC.grid.color;
      ctx.lineWidth = 0.5;
      const gridSize = CINEMATIC.grid.size;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw orbs with slow, hypnotic motion
      orbsRef.current.forEach((orb) => {
        orb.phase += orb.speed;

        // Organic drift using sine/cosine
        const driftX = Math.sin(orb.phase) * orb.amplitude;
        const driftY = Math.cos(orb.phase * 0.7) * orb.amplitude * 0.6;

        const orbX = orb.x + driftX;
        const orbY = orb.y + driftY;

        // Radial gradient for orb
        const orbGradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orb.radius);
        const colorMatch = orb.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);

        if (colorMatch) {
          const [, r, g, b] = colorMatch;
          orbGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.15)`);
          orbGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.08)`);
          orbGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        }

        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(orbX, orbY, orb.radius, 0, Math.PI * 2);
        ctx.fill();

        // Heavy blur effect (simulated with multiple layers)
        ctx.filter = 'blur(60px)';
        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(orbX, orbY, orb.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = 'none';
      });

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 16; // ~60fps

        const lifeRatio = p.life / p.maxLife;
        const alpha = p.opacity * lifeRatio;

        ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Emit new particles occasionally
      if (frameCount % Math.round(60 / CINEMATIC.dust.emissionRate) === 0) {
        if (particlesRef.current.length < CINEMATIC.dust.maxCount) {
          emitParticle();
        }
      }

      // Draw noise texture overlay (very subtle, anti-banding)
      if (noiseTextureRef.current) {
        ctx.globalAlpha = CINEMATIC.noise.opacity;
        for (let i = 0; i < canvas.width; i += 200) {
          for (let j = 0; j < canvas.height; j += 200) {
            ctx.putImageData(noiseTextureRef.current, i, j);
          }
        }
        ctx.globalAlpha = 1;
      }

      // Draw vignette (darkening at edges)
      const vignetteGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) * 0.3,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
      );
      vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frameCount++;
      requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          display: 'block',
        }}
        aria-hidden="true"
      />

      {/* Overlay for additional gradient effects */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: CINEMATIC.background.overlay,
          pointerEvents: 'none',
          zIndex: -1,
        }}
        aria-hidden="true"
      />
    </>
  );
}
