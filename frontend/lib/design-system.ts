/**
 * Design System Tokens
 * Premium glassmorphism + motion design for CommodityBubbles
 */

// ============================================================================
// GLASS & BACKDROP EFFECTS
// ============================================================================

export const GLASS = {
  // Backdrop blur values (pixels)
  blur: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },

  // Background colors for glass surfaces
  bg: {
    dark: 'rgba(15, 20, 25, 0.8)',      // #0f1419 with 80% opacity
    darker: 'rgba(5, 6, 8, 0.9)',        // #050608 with 90% opacity
    panel: 'rgba(20, 27, 35, 0.75)',     // Slightly lighter for panels
  },

  // Border styling
  border: {
    light: '1px solid rgba(255, 255, 255, 0.1)',
    lighter: '1px solid rgba(255, 255, 255, 0.05)',
    accent: '2px solid rgba(255, 255, 255, 0.15)',
  },

  // Shadow styling for depth
  shadow: {
    inner: 'inset 0 1px 2px rgba(255, 255, 255, 0.05)',
    outer: '0 8px 32px rgba(0, 0, 0, 0.3)',
    glow: '0 0 20px rgba(255, 255, 255, 0.1)',
  },

  // Combined effect for standard glass panel
  standard: `
    background: rgba(15, 20, 25, 0.8);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3);
  `,
} as const;

// ============================================================================
// ANIMATION & MOTION TIMING
// ============================================================================

export const MOTION = {
  // Duration (milliseconds)
  duration: {
    instant: 100,
    quick: 200,
    normal: 300,
    slow: 500,
    slower: 800,
    slowest: 1200,
  },

  // Easing functions (CSS cubic-bezier)
  easing: {
    // Spring-like snappy motion
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    // Smooth, natural deceleration
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Sharp, quick entrance
    sharp: 'cubic-bezier(0.4, 0, 1, 1)',
    // Gentle ease-in for floating
    float: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    // Material Design standard
    material: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },

  // Stagger timing for multiple elements (ms per item)
  stagger: {
    tight: 20,
    normal: 40,
    relaxed: 60,
  },
} as const;

// ============================================================================
// TYPOGRAPHY - BUBBLE & TICKER SYMBOLS
// ============================================================================

export const TYPOGRAPHY = {
  // Ticker symbol (inside bubbles) - must be highly legible
  ticker: {
    family: '"IBM Plex Mono", "Courier New", monospace',
    weight: 600, // Semibold for legibility
    size: {
      sm: '10px',  // For small bubbles (radius 25px)
      md: '14px',  // For medium bubbles (radius 35px)
      lg: '18px',  // For large bubbles (radius 45px+)
    },
    lineHeight: 1.1,
    letterSpacing: '0.02em',
  },

  // Header text
  heading: {
    family: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
    weight: 700, // Bold
    size: {
      h1: '48px',
      h2: '36px',
      h3: '24px',
      h4: '18px',
    },
    lineHeight: 1.2,
  },

  // Body text
  body: {
    family: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
    weight: 400,
    size: {
      sm: '12px',
      md: '14px',
      lg: '16px',
    },
    lineHeight: 1.5,
  },

  // Label/tag text
  label: {
    family: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
    weight: 600,
    size: '11px',
    lineHeight: 1.4,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
} as const;

// ============================================================================
// COLOR SENTIMENT SYSTEM
// ============================================================================

export const SENTIMENT = {
  bullish: {
    color: '#10b981',      // Emerald
    glow: 'rgba(16, 185, 129, 0.4)',
    light: '#d1fae5',
    dark: '#064e3b',
  },
  bearish: {
    color: '#ef4444',      // Red
    glow: 'rgba(239, 68, 68, 0.4)',
    light: '#fee2e2',
    dark: '#7f1d1d',
  },
  neutral: {
    color: '#f59e0b',      // Amber
    glow: 'rgba(245, 158, 11, 0.4)',
    light: '#fef3c7',
    dark: '#78350f',
  },
} as const;

// ============================================================================
// BUBBLE VISUALIZATION PARAMETERS
// ============================================================================

export const BUBBLE = {
  // Size parameters
  size: {
    minRadius: 25,    // Minimum bubble radius (px)
    maxRadius: 45,    // Maximum bubble radius (px)
    volatilityFactor: 20, // Radius adjustment per 10% volatility
  },

  // Glow parameters (radius expansion based on sentiment)
  glow: {
    bullish: 24,   // Strong positive signal
    neutral: 14,   // Balanced
    bearish: 6,    // Subtle/warning
  },

  // Animations
  animation: {
    entrance: {
      duration: 800,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Spring
      staggerDelay: 40, // ms per bubble
    },
    idle: {
      floatAmplitude: 8,   // px
      floatFrequency: 0.015, // radians per frame
      driftDamping: 0.98,   // Velocity damping
    },
    hover: {
      scale: 1.15,
      glowExpansion: 8,
      duration: 300,
    },
    selection: {
      scale: 1.3,
      glowExpansion: 15,
      duration: 400,
    },
  },

  // Particle system
  particles: {
    maxCount: 100,
    emissionRate: 4, // New particles every N frames
    lifetime: {
      min: 800,
      max: 1200,
    },
    size: {
      min: 0.5,
      max: 2,
    },
    velocity: {
      x: 0.4,  // Max random velocity
      y: 0.4,
      drift: 0.2, // Upward drift acceleration
    },
    opacity: {
      max: 0.15,
      decay: 'linear',
    },
  },

  // Canvas background grid
  grid: {
    cellSize: 40,
    strokeWidth: 1,
    opacity: 0.03,
    color: 'rgba(255, 255, 255, 0.03)',
  },

  // Rim light (top-left highlight)
  rimLight: {
    angle: 45, // degrees
    opacity: 0.3,
    blurRadius: 20,
  },

  // Bounce physics
  physics: {
    wallDamping: 0.85,
    friction: 0.98,
    wallCollisionRadius: 10, // Detection radius (px)
  },
} as const;

// ============================================================================
// DETAIL CARD PARAMETERS
// ============================================================================

export const DETAIL_CARD = {
  // Dimensions
  minWidth: '320px',
  maxWidth: '400px',
  maxHeight: '600px',

  // Animation
  animation: {
    entrance: {
      duration: 400,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    exit: {
      duration: 200,
      easing: 'cubic-bezier(1, 0, 0.4, 1)',
    },
  },

  // Sentiment dial (SVG progress ring)
  sentimentDial: {
    radius: 45,
    strokeWidth: 6,
    size: 120,
  },

  // Signal bars styling
  signals: {
    barHeight: '8px',
    barRadius: '4px',
    colors: {
      reddit: '#ea580c',
      news: '#f1f5f9',
      twitter: '#3b82f6',
      onchain: '#a855f7',
    },
  },
} as const;

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ============================================================================
// ACCESSIBILITY & FALLBACKS
// ============================================================================

export const A11Y = {
  // Reduced motion query
  prefersReducedMotion: '@media (prefers-reduced-motion: reduce)',

  // High contrast mode
  highContrastMode: '@media (prefers-contrast: more)',

  // Touch-friendly sizes (min 44x44 tap target)
  minTapTarget: '44px',

  // Focus indicators
  focusRing: '2px solid rgba(59, 130, 246, 0.5)',
  focusRingOffset: '2px',
} as const;

// ============================================================================
// UTILITY: Get safe values for reduced-motion users
// ============================================================================

export function getMotionDuration(
  normal: number,
  reducedMotion: number = 100
): { normal: string; reduced: string } {
  return {
    normal: `${normal}ms`,
    reduced: `${reducedMotion}ms`,
  };
}

// ============================================================================
// UTILITY: Generate CSS for glass effect
// ============================================================================

export function glassEffect(
  blurSize: keyof typeof GLASS.blur = 'md',
  bgColor: keyof typeof GLASS.bg = 'dark'
): string {
  return `
    background: ${GLASS.bg[bgColor]};
    backdrop-filter: blur(${GLASS.blur[blurSize]});
    border: ${GLASS.border.light};
    box-shadow: ${GLASS.shadow.inner}, ${GLASS.shadow.outer};
  `;
}

// ============================================================================
// UTILITY: Generate animation CSS
// ============================================================================

export function animationCSS(
  property: string,
  duration: keyof typeof MOTION.duration,
  easing: keyof typeof MOTION.easing
): string {
  return `
    transition: ${property} ${MOTION.duration[duration]}ms ${MOTION.easing[easing]};
  `;
}
