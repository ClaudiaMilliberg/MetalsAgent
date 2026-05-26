/**
 * Cinematic Design System
 * Premium glassmorphism, physics-based motion, lighting, and commodity color palette for CommodityBubbles
 */

// ============================================================================
// COMMODITY TIER SYSTEM & COLOR PALETTE
// ============================================================================

export const COMMODITY_COLORS = {
  // TIER 1 - FLAGSHIP COMMODITIES (Maximum Glow & Presence)
  copper: {
    name: 'Copper',
    tier: 1,
    icon: 'Cable',
    primary: '#FF6B35',
    gradient: {
      center: '#FFB366',
      edge: '#CC4422',
    },
    rimLight: 'rgba(255, 107, 53, 0.8)',
    specular: 'rgba(255, 200, 150, 0.9)',
    glow: {
      base: 'rgba(255, 107, 53, 0.6)',
      bullish: 95,
      neutral: 75,
      bearish: 45,
    },
    sentiment: {
      bullish: { brightness: 1.25, saturation: 1.3 },
      neutral: { brightness: 1.0, saturation: 1.0 },
      bearish: { brightness: 0.8, saturation: 0.85 },
    },
  },
  uranium: {
    name: 'Uranium',
    tier: 1,
    icon: 'Atom',
    primary: '#39FF14',
    gradient: {
      center: '#66FF4D',
      edge: '#1F9600',
    },
    rimLight: 'rgba(57, 255, 20, 0.85)',
    specular: 'rgba(150, 255, 100, 0.95)',
    glow: {
      base: 'rgba(57, 255, 20, 0.65)',
      bullish: 95,
      neutral: 75,
      bearish: 45,
    },
    sentiment: {
      bullish: { brightness: 1.3, saturation: 1.35 },
      neutral: { brightness: 1.0, saturation: 1.0 },
      bearish: { brightness: 0.75, saturation: 0.8 },
    },
  },
  gold: {
    name: 'Gold',
    tier: 1,
    icon: 'Coins',
    primary: '#FFD700',
    gradient: {
      center: '#FFEC99',
      edge: '#B39200',
    },
    rimLight: 'rgba(255, 215, 0, 0.8)',
    specular: 'rgba(255, 240, 150, 0.92)',
    glow: {
      base: 'rgba(255, 215, 0, 0.55)',
      bullish: 88,
      neutral: 72,
      bearish: 55,
    },
    sentiment: {
      bullish: { brightness: 1.22, saturation: 1.25 },
      neutral: { brightness: 1.0, saturation: 1.0 },
      bearish: { brightness: 0.82, saturation: 0.88 },
    },
  },
  silver: {
    name: 'Silver',
    tier: 2,
    icon: 'CircleDollarSign',
    primary: '#C0C0C0',
    gradient: {
      center: '#E8E8E8',
      edge: '#808080',
    },
    rimLight: 'rgba(192, 192, 192, 0.75)',
    specular: 'rgba(240, 240, 240, 0.88)',
    glow: {
      base: 'rgba(192, 192, 192, 0.45)',
      bullish: 65,
      neutral: 55,
      bearish: 40,
    },
    sentiment: {
      bullish: { brightness: 1.18, saturation: 1.2 },
      neutral: { brightness: 1.0, saturation: 1.0 },
      bearish: { brightness: 0.85, saturation: 0.9 },
    },
  },
  nickel: {
    name: 'Nickel',
    tier: 2,
    icon: 'Hexagon',
    primary: '#4FC3F7',
    gradient: {
      center: '#81D4FA',
      edge: '#0288D1',
    },
    rimLight: 'rgba(79, 195, 247, 0.8)',
    specular: 'rgba(179, 229, 252, 0.9)',
    glow: {
      base: 'rgba(79, 195, 247, 0.5)',
      bullish: 72,
      neutral: 60,
      bearish: 42,
    },
    sentiment: {
      bullish: { brightness: 1.2, saturation: 1.22 },
      neutral: { brightness: 1.0, saturation: 1.0 },
      bearish: { brightness: 0.83, saturation: 0.87 },
    },
  },
  lithium: {
    name: 'Lithium',
    tier: 2,
    icon: 'BatteryCharging',
    primary: '#B71AFF',
    gradient: {
      center: '#D966FF',
      edge: '#7700CC',
    },
    rimLight: 'rgba(183, 26, 255, 0.82)',
    specular: 'rgba(220, 150, 255, 0.91)',
    glow: {
      base: 'rgba(183, 26, 255, 0.52)',
      bullish: 78,
      neutral: 64,
      bearish: 44,
    },
    sentiment: {
      bullish: { brightness: 1.24, saturation: 1.28 },
      neutral: { brightness: 1.0, saturation: 1.0 },
      bearish: { brightness: 0.81, saturation: 0.85 },
    },
  },
  cobalt: {
    name: 'Cobalt',
    tier: 3,
    icon: 'Snowflake',
    primary: '#1E90FF',
    gradient: {
      center: '#6EB5FF',
      edge: '#003DA5',
    },
    rimLight: 'rgba(30, 144, 255, 0.78)',
    specular: 'rgba(150, 200, 255, 0.87)',
    glow: {
      base: 'rgba(30, 144, 255, 0.48)',
      bullish: 68,
      neutral: 56,
      bearish: 38,
    },
    sentiment: {
      bullish: { brightness: 1.19, saturation: 1.21 },
      neutral: { brightness: 1.0, saturation: 1.0 },
      bearish: { brightness: 0.84, saturation: 0.89 },
    },
  },
  palladium: {
    name: 'Palladium',
    tier: 3,
    icon: 'Gem',
    primary: '#00D9FF',
    gradient: {
      center: '#5FF0FF',
      edge: '#0099BB',
    },
    rimLight: 'rgba(0, 217, 255, 0.79)',
    specular: 'rgba(150, 240, 255, 0.89)',
    glow: {
      base: 'rgba(0, 217, 255, 0.5)',
      bullish: 70,
      neutral: 58,
      bearish: 40,
    },
    sentiment: {
      bullish: { brightness: 1.21, saturation: 1.23 },
      neutral: { brightness: 1.0, saturation: 1.0 },
      bearish: { brightness: 0.82, saturation: 0.88 },
    },
  },
} as const;

// ============================================================================
// CINEMATIC GRADIENT & LIGHTING
// ============================================================================

export const CINEMATIC = {
  // Deep gradient: obsidian → navy → charcoal
  background: {
    gradient: `radial-gradient(
      circle at 50% 50%,
      #0f1419 0%,
      #0a0e1a 30%,
      #050608 100%
    )`,
    overlay: `linear-gradient(
      135deg,
      rgba(10, 14, 26, 0.05) 0%,
      rgba(5, 6, 8, 0.1) 100%
    )`,
    vignette: `radial-gradient(
      circle at 50% 50%,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.3) 100%
    )`,
  },

  // Lighting simulation (top-left light source)
  lighting: {
    primary: {
      angle: 45,
      position: 'top-left',
      intensity: 0.3,
      color: 'rgba(100, 200, 255, 0.15)',
    },
    accent: {
      angle: -135,
      position: 'bottom-right',
      intensity: 0.1,
      color: 'rgba(200, 100, 255, 0.08)',
    },
  },

  // Floating ambient orbs (commodity-themed: copper, uranium, cobalt, palladium)
  orbs: {
    count: 4,
    colors: [
      'rgba(255, 107, 53, 0.08)',    // Copper (molten orange)
      'rgba(57, 255, 20, 0.08)',     // Uranium (neon green)
      'rgba(30, 144, 255, 0.06)',    // Cobalt (deep blue)
      'rgba(0, 217, 255, 0.08)',     // Palladium (icy cyan)
    ],
    radii: [120, 140, 160, 100],
    speeds: [0.0003, 0.0002, 0.00025, 0.00035],
    drift: {
      amplitude: 100,
      frequency: 0.0005,
    },
  },

  // Noise texture (subtle, anti-banding)
  noise: {
    opacity: 0.02,
    scale: 200,
    speed: 0.0001,
  },

  // Grid (very faint, for depth)
  grid: {
    size: 60,
    opacity: 0.015,
    color: 'rgba(255, 255, 255, 0.015)',
    glow: 'rgba(100, 200, 255, 0.02)',
  },

  // Dust particles (slow drift, lifespan)
  dust: {
    maxCount: 80,
    emissionRate: 2,
    lifetime: {
      min: 4000,
      max: 8000,
    },
    velocity: {
      x: 0.02,
      y: -0.05,
    },
    size: {
      min: 0.5,
      max: 2,
    },
    opacity: 0.08,
    color: 'rgba(200, 220, 255, 0.08)',
  },
} as const;

// ============================================================================
// GLASSMORPHISM LAYERS
// ============================================================================

export const GLASS_LAYERS = {
  // Base panel
  base: {
    background: 'rgba(15, 20, 25, 0.85)',
    blur: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },

  // Highlight layer (inner light edge)
  highlight: {
    position: 'absolute',
    top: '1px',
    left: '1px',
    right: '1px',
    height: '1px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05), transparent)',
    borderRadius: 'inherit',
  },

  // Edge glow (rim lighting)
  rimLight: {
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    background: 'radial-gradient(ellipse at top left, rgba(100, 200, 255, 0.1), transparent 50%)',
    pointerEvents: 'none',
  },

  // Noise layer (prevent banding)
  noise: {
    position: 'absolute',
    inset: 0,
    background: 'url(data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="1" /%3E%3C/filter%3E%3Crect width="200" height="200" filter="url(%23noise)" opacity="0.03"/%3E%3C/svg%3E)',
    opacity: 0.02,
    pointerEvents: 'none',
  },

  // Multi-layer shadow
  shadow: `
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 8px 16px rgba(0, 0, 0, 0.3),
    0 16px 32px rgba(0, 0, 0, 0.2)
  `,
} as const;

// ============================================================================
// PREMIUM BUBBLE SYSTEM
// ============================================================================

export const BUBBLE_PREMIUM = {
  // Radial gradient (bright center → dark edge)
  gradient: {
    inner: 'rgba(255, 255, 255, 0.3)',
    middle: 'rgba(255, 255, 255, 0.1)',
    outer: 'rgba(255, 255, 255, 0)',
  },

  // Rim light (thin bright ring)
  rimLight: {
    width: 2,
    opacity: 0.4,
    blur: '2px',
    color: 'rgba(255, 255, 255, 0.5)',
  },

  // Specular highlight (small white dot, light reflection)
  specular: {
    size: 12,  // % of bubble radius
    offset: {
      x: -30,  // pixels
      y: -30,
    },
    opacity: {
      default: 0.4,
      hover: 0.6,
      active: 0.8,
    },
    blur: '3px',
  },

  // Soft glow (scales with sentiment)
  glow: {
    radius: {
      bullish: 40,
      neutral: 25,
      bearish: 12,
    },
    opacity: {
      bullish: 0.4,
      neutral: 0.3,
      bearish: 0.15,
    },
    blur: '20px',
  },

  // Breathing animation (subtle scale pulse)
  breathing: {
    amplitude: 0.015,  // ±1.5%
    frequency: 0.001,  // frequency (radians/ms)
    easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },

  // Organic drift (Perlin-like noise)
  drift: {
    speed: {
      min: 0.0005,
      max: 0.001,
    },
    amplitude: {
      x: 30,
      y: 20,
    },
    phases: {
      min: 0,
      max: Math.PI * 2,
    },
    inertia: 0.95,
  },

  // Focus field (repulsion when hovering nearby)
  focus: {
    radius: 150,
    repulsion: 1.2,
    strength: 0.5,
  },

  // Selection spotlight
  selection: {
    scale: 1.35,
    glowMultiplier: 1.5,
    dimOthers: 0.3,
    spotlightRadius: 200,
  },

  // Physics constraints
  physics: {
    damping: 0.98,
    springK: 0.05,
    maxVelocity: 2,
  },
} as const;

// ============================================================================
// TYPOGRAPHY - CINEMATIC TICKER RENDERING
// ============================================================================

export const TICKER_TYPOGRAPHY = {
  family: '"IBM Plex Mono", "Courier New", monospace',
  weight: 700,  // Bold for legibility
  sizes: {
    sm: '9px',
    md: '13px',
    lg: '16px',
  },
  lineHeight: 1.1,
  letterSpacing: '0.03em',
  color: '#ffffff',

  // Metallic sheen effect on hover
  sheen: {
    gradient: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0), rgba(255,255,255,0.1))',
    opacity: {
      default: 0,
      hover: 0.4,
    },
    transition: 'opacity 300ms ease-out',
  },

  // Text shadow for contrast
  shadow: '0 2px 4px rgba(0, 0, 0, 0.6), 0 0 8px rgba(0, 0, 0, 0.4)',

  // Inner glow (subtle)
  innerGlow: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))',
} as const;

// ============================================================================
// MOTION & PHYSICS
// ============================================================================

export const MOTION_CINEMATIC = {
  // Spring physics (snappy, premium feel)
  spring: {
    tension: 200,
    friction: 26,
    mass: 1,
  },

  // Entrance animation (drift in from edges)
  entrance: {
    duration: 1200,
    delay: 50,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  // Exit animation (drift away, fade)
  exit: {
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
  },

  // Hover transition
  hover: {
    duration: 300,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',  // Spring
  },

  // Selection transition
  selection: {
    duration: 400,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Ambient orb movement
  orbs: {
    duration: 30000,  // 30 second cycle
    easing: 'linear',
  },

  // Dust particle drift
  dust: {
    driftDuration: 5000,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
} as const;

// ============================================================================
// DETAIL CARD - MICRO ANIMATIONS
// ============================================================================

export const DETAIL_CARD_CINEMATIC = {
  // Card entry animation
  entry: {
    duration: 600,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    initialOpacity: 0,
    initialScale: 0.95,
    initialY: 20,
  },

  // Metric stagger (load numbers one by one)
  metricStagger: {
    duration: 200,
    delay: 100,
  },

  // Sentiment dial animation
  dial: {
    duration: 1000,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    initialAngle: 0,
    targetAngle: (score: number) => (score / 100) * 360,
  },

  // Glow ring pulse
  glowPulse: {
    duration: 2000,
    easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
    opacityMin: 0.2,
    opacityMax: 0.6,
  },

  // Signal bar fill animation
  signalBar: {
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    stagger: 100,
  },
} as const;

// ============================================================================
// COLORS & SENTIMENT
// ============================================================================

export const SENTIMENT_CINEMATIC = {
  bullish: {
    primary: '#10b981',
    glow: 'rgba(16, 185, 129, 0.6)',
    light: '#d1fae5',
    luminance: 1.2,
  },
  bearish: {
    primary: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.5)',
    light: '#fee2e2',
    luminance: 0.8,
  },
  neutral: {
    primary: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.5)',
    light: '#fef3c7',
    luminance: 1,
  },
} as const;

// ============================================================================
// REDUCED MOTION SUPPORT
// ============================================================================

export const REDUCED_MOTION = {
  // When prefers-reduced-motion is set
  fallback: {
    // Disable all animations
    animation: 'none',
    transition: 'none',
    transform: 'none',

    // Keep static effects (glow, color, shadow)
    staticEffects: {
      glow: true,
      gradient: true,
      shadow: true,
      color: true,
    },
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate glassmorphic panel CSS
 */
export function glassPanel(variant: 'base' = 'base'): string {
  const layer = GLASS_LAYERS.base;
  return `
    background: ${layer.background};
    backdrop-filter: blur(${layer.blur});
    border: ${layer.border};
    box-shadow: ${layer.shadow};
  `;
}

/**
 * Generate bubble gradient CSS
 */
export function bubbleGradient(color: string): string {
  return `
    radial-gradient(
      circle at center,
      ${color},
      ${color}cc,
      ${color}44,
      ${color}00
    )
  `;
}

/**
 * Generate sentiment glow CSS (commodity-aware)
 */
export function sentimentGlow(sentiment: 'bullish' | 'bearish' | 'neutral', glowColor?: string): string {
  const glowConfig = BUBBLE_PREMIUM.glow.radius;
  const defaultGlow = SENTIMENT_CINEMATIC[sentiment].glow;
  const color = glowColor || defaultGlow;

  return `
    0 0 ${glowConfig[sentiment]}px ${color},
    0 0 ${glowConfig[sentiment] * 0.5}px ${color}
  `;
}

/**
 * Generate spring physics motion CSS
 */
export function springMotion(
  property: string,
  tension: number = 200,
  friction: number = 26
): string {
  // Convert spring physics to cubic-bezier approximation
  const easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  return `${property} 300ms ${easing}`;
}

/**
 * Generate Perlin-like noise path
 */
export function perlinNoisePath(
  t: number,
  amplitude: { x: number; y: number },
  frequency: { x: number; y: number }
): { x: number; y: number } {
  // Simplified Perlin-like noise using multiple sine waves
  const x =
    Math.sin(t * frequency.x) * amplitude.x * 0.5 +
    Math.sin(t * frequency.x * 0.5 + 1.234) * amplitude.x * 0.3 +
    Math.sin(t * frequency.x * 2 - 0.789) * amplitude.x * 0.2;

  const y =
    Math.cos(t * frequency.y) * amplitude.y * 0.5 +
    Math.cos(t * frequency.y * 0.5 + 2.345) * amplitude.y * 0.3 +
    Math.cos(t * frequency.y * 2 - 1.234) * amplitude.y * 0.2;

  return { x, y };
}

/**
 * Calculate distance between two points
 */
export function distance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Calculate repulsion force for collision avoidance
 */
export function repulsionForce(
  current: { x: number; y: number },
  other: { x: number; y: number },
  focusRadius: number,
  strength: number
): { x: number; y: number } {
  const dist = distance(current, other);

  if (dist > focusRadius || dist === 0) {
    return { x: 0, y: 0 };
  }

  // Repulsion inversely proportional to distance
  const force = (strength * (focusRadius - dist)) / focusRadius;
  const angle = Math.atan2(current.y - other.y, current.x - other.x);

  return {
    x: Math.cos(angle) * force,
    y: Math.sin(angle) * force,
  };
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Generate vignette gradient
 */
export function vignette(intensity: number = 0.3): string {
  return `
    radial-gradient(
      circle at 50% 50%,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, ${intensity}) 100%
    )
  `;
}

/**
 * Get commodity color configuration by symbol
 */
export function getCommodityColor(symbol: string): typeof COMMODITY_COLORS.copper {
  const commodityKey = symbol.toLowerCase();
  return COMMODITY_COLORS[commodityKey as keyof typeof COMMODITY_COLORS] || COMMODITY_COLORS.gold;
}

/**
 * Calculate sentiment-based glow intensity (0-100)
 * Uses formula: baseGlowIntensity[sentiment] * (sentimentScore / 100)
 */
export function calculateGlowIntensity(
  sentiment: 'bullish' | 'bearish' | 'neutral',
  sentimentScore: number,
  baseIntensity: number = 100
): number {
  const commodityIntensity = { bullish: 95, neutral: 75, bearish: 45 }[sentiment];
  return (commodityIntensity / 100) * (sentimentScore / 100) * baseIntensity;
}

/**
 * Apply sentiment-based brightness and saturation modulation
 * Returns HSL adjustments for commodity colors
 */
export function modifySentimentBrightness(
  sentiment: 'bullish' | 'bearish' | 'neutral',
  commodityColor: typeof COMMODITY_COLORS.copper
): { brightness: number; saturation: number } {
  return commodityColor.sentiment[sentiment];
}

/**
 * Calculate glow radius based on sentiment and sentiment score
 * Scales from 12px (bearish) to 40px (bullish) with score multiplier
 */
export function calculateGlowRadius(
  sentiment: 'bullish' | 'bearish' | 'neutral',
  sentimentScore: number = 100
): number {
  const baseRadius = BUBBLE_PREMIUM.glow.radius[sentiment];
  const multiplier = sentimentScore / 100;
  return baseRadius * multiplier;
}

/**
 * Get Lucide icon name for commodity
 */
export function getCommodityIcon(symbol: string): string {
  const commodity = getCommodityColor(symbol);
  return commodity.icon;
}

/**
 * Convert RGB to HSL for sentiment modulation
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h, s, l };
}

/**
 * Apply sentiment modulation to commodity color
 * Returns modified color with brightness/saturation adjustments
 */
export function applySentimentModulation(
  hexColor: string,
  sentiment: 'bullish' | 'bearish' | 'neutral',
  commodityColor: typeof COMMODITY_COLORS.copper
): string {
  // Parse hex color
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Convert to HSL
  const { h, s, l } = rgbToHsl(r, g, b);

  // Apply sentiment modulation
  const modulation = commodityColor.sentiment[sentiment];
  const newL = Math.min(1, Math.max(0, l * modulation.brightness));
  const newS = Math.min(1, Math.max(0, s * modulation.saturation));

  // Convert back to hex (simplified - full HSL to RGB would be more complex)
  return hexColor; // Placeholder - implement full HSL conversion as needed
}
