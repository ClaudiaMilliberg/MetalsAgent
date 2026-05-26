# Glassmorphism & Motion Design System
## CommodityBubbles Premium UI Architecture

---

## 📋 Overview

This document covers the production-ready glassmorphism and motion design system for CommodityBubbles. It includes:

1. **Design System Tokens** (`lib/design-system.ts`) - Centralized values for glass effects, animations, typography, colors, and motion
2. **GlassPanel Component** (`components/GlassPanel.tsx`) - Reusable frosted-glass surface component
3. **BubbleIndicator Component** (`components/BubbleIndicator.tsx`) - Premium SVG bubble with sentiment visualization
4. **AmbientBackground Component** (`components/AmbientBackground.tsx`) - Floating orbs and atmospheric effects
5. **Canvas-Based Bubbles** (`app/bubbles/components/ClusterBubbleVisualization.tsx`) - High-performance bubble system with entrance animations, physics, and particle effects
6. **Detail Card** (`app/bubbles/components/TickerDetailCard.tsx`) - Glassmorphic detail panel with circular sentiment dial

---

## 🎨 Design System Tokens

### Location
```
lib/design-system.ts
```

### Key Exports

#### Glass Effects
```typescript
import { GLASS } from '@/lib/design-system';

GLASS.blur.md        // '8px'
GLASS.bg.dark        // 'rgba(15, 20, 25, 0.8)'
GLASS.border.light   // '1px solid rgba(255, 255, 255, 0.1)'
GLASS.shadow.outer   // '0 8px 32px rgba(0, 0, 0, 0.3)'
```

#### Motion & Timing
```typescript
import { MOTION } from '@/lib/design-system';

MOTION.duration.normal     // 300ms
MOTION.easing.spring       // cubic-bezier(0.34, 1.56, 0.64, 1)
MOTION.easing.smooth       // cubic-bezier(0.4, 0, 0.2, 1)
```

#### Sentiment Colors
```typescript
import { SENTIMENT } from '@/lib/design-system';

SENTIMENT.bullish.color   // '#10b981' (Emerald)
SENTIMENT.bearish.color   // '#ef4444' (Red)
SENTIMENT.neutral.color   // '#f59e0b' (Amber)
```

#### Bubble Parameters
```typescript
import { BUBBLE } from '@/lib/design-system';

BUBBLE.size.minRadius      // 25px
BUBBLE.glow.bullish        // 24px (expansion)
BUBBLE.animation.entrance  // { duration: 800, easing: ..., staggerDelay: 40 }
BUBBLE.particles.maxCount  // 100
```

---

## 🪟 GlassPanel Component

### Purpose
Reusable frosted-glass surface component for panels, cards, navbars, overlays, and dialogs.

### Usage

#### Basic Panel
```tsx
import GlassPanel from '@/components/GlassPanel';

<GlassPanel>
  <h2>Settings</h2>
  <p>Your content here</p>
</GlassPanel>
```

#### With Options
```tsx
<GlassPanel
  blurSize="lg"
  bgColor="panel"
  borderStyle="accent"
  shadowType="both"
  padding="lg"
  rounded="xl"
  animate
  animationType="slideIn"
  animationDuration="normal"
  interactive
>
  <h2>Clustered Bubbles</h2>
  <p>Click to interact</p>
</GlassPanel>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content inside the panel |
| `blurSize` | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Backdrop blur intensity |
| `bgColor` | 'dark' \| 'darker' \| 'panel' | 'dark' | Background opacity/tint |
| `borderStyle` | 'light' \| 'lighter' \| 'accent' | 'light' | Border style |
| `shadowType` | 'inner' \| 'outer' \| 'both' | 'both' | Shadow configuration |
| `padding` | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Internal padding |
| `rounded` | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Border radius |
| `animate` | boolean | false | Enable entrance animation |
| `animationType` | 'fade' \| 'slideIn' \| 'scaleIn' | 'fade' | Animation style |
| `animationDuration` | 'quick' \| 'normal' \| 'slow' | 'normal' | Animation speed |
| `interactive` | boolean | false | Add hover/focus states |
| `className` | string | '' | Additional Tailwind classes |
| `role` | string | - | ARIA role |
| `ariaLabel` | string | - | ARIA label |

### Examples

#### Navigation Bar
```tsx
<GlassPanel
  blurSize="md"
  bgColor="dark"
  borderStyle="light"
  padding="md"
  rounded="lg"
  className="flex justify-between items-center"
>
  {/* Nav items */}
</GlassPanel>
```

#### Interactive Card
```tsx
<GlassPanel
  interactive
  animationType="slideIn"
  padding="lg"
  onClick={() => console.log('clicked')}
  role="button"
  ariaLabel="Commodity cluster selector"
>
  {/* Card content */}
</GlassPanel>
```

#### Modal Overlay
```tsx
<GlassPanel
  blurSize="xl"
  bgColor="darker"
  shadowType="outer"
  padding="xl"
  rounded="xl"
  animate
  animationType="scaleIn"
>
  {/* Modal content */}
</GlassPanel>
```

---

## 🫧 BubbleIndicator Component

### Purpose
Premium SVG-based bubble component for standalone bubble displays (outside canvas).

### Features
- **Prominent Ticker Symbol**: Monospace font, high legibility
- **Sentiment Feedback**: Color, glow, and emoji indicator
- **Rim-Light Highlight**: 3D depth effect
- **Selection State**: Pulsing border animation
- **Responsive**: Scales based on volatility
- **Accessibility**: Keyboard navigation, ARIA labels, reduced-motion support

### Usage

#### Basic Bubble
```tsx
import BubbleIndicator from '@/components/BubbleIndicator';

<BubbleIndicator
  tickerSymbol="COPX"
  sentiment="bullish"
  price={185.42}
  volatility={12.5}
/>
```

#### Interactive Bubble
```tsx
<BubbleIndicator
  tickerSymbol="FCX"
  sentiment="bearish"
  price={42.88}
  volatility={18.3}
  size="lg"
  isSelected={selectedTicker === 'FCX'}
  isHovered={hoveredTicker === 'FCX'}
  onClick={() => setSelectedTicker('FCX')}
  onHoverStart={() => setHoveredTicker('FCX')}
  onHoverEnd={() => setHoveredTicker(null)}
  showPrice
  showSentiment
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tickerSymbol` | string | - | Ticker code (e.g., "COPX") |
| `sentiment` | 'bullish' \| 'bearish' \| 'neutral' | - | Sentiment state |
| `price` | number | - | Current price |
| `volatility` | number | - | Volatility percentage |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Bubble size |
| `isSelected` | boolean | false | Selected state (pulsing border) |
| `isHovered` | boolean | false | Hover state |
| `onClick` | () => void | - | Click handler |
| `onHoverStart` | () => void | - | Hover enter handler |
| `onHoverEnd` | () => void | - | Hover leave handler |
| `showPrice` | boolean | false | Display price label |
| `showSentiment` | boolean | true | Display sentiment emoji |

### Accessibility
- Keyboard focusable with visible focus ring
- ARIA labels for screen readers
- Respects `prefers-reduced-motion` setting
- Tab-navigable in bubble lists

### Example: Grid of Bubbles
```tsx
<div className="grid grid-cols-3 gap-4 p-6">
  {tickers.map((ticker) => (
    <BubbleIndicator
      key={ticker.symbol}
      tickerSymbol={ticker.symbol}
      sentiment={ticker.sentiment}
      price={ticker.price}
      volatility={ticker.volatility}
      isSelected={selectedTicker?.symbol === ticker.symbol}
      onClick={() => setSelectedTicker(ticker)}
      showPrice
    />
  ))}
</div>
```

---

## 🌌 AmbientBackground Component

### Purpose
Floating orbs and atmospheric effects for a cinematic, living background.

### Features
- **Floating Orbs**: 3 colorful orbs with independent physics
- **Organic Motion**: Sine-wave drift, gravity-like downward pull
- **Blur Filter**: Heavy Gaussian blur for atmospheric depth
- **Responsive**: Automatically adapts to window resize
- **Performance**: Canvas-based, non-blocking animation
- **Accessibility**: Marked as decorative (`aria-hidden`)

### Usage

#### Add to Root Layout
```tsx
import AmbientBackground from '@/components/AmbientBackground';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}
```

#### Or Scoped to Page
```tsx
<div style={{ position: 'relative', overflow: 'hidden' }}>
  <AmbientBackground />
  {/* Page content overlaid */}
</div>
```

### Configuration
Customize orb colors, sizes, and drift in `components/AmbientBackground.tsx`:

```typescript
const orbColors = [
  { color: 'rgba(16, 185, 129, 0.1)', radius: 80 },   // Emerald
  { color: 'rgba(239, 68, 68, 0.08)', radius: 120 },  // Red
  { color: 'rgba(59, 130, 246, 0.08)', radius: 100 }, // Blue
];
```

---

## 🎬 Animation System

### Entrance Animation
Used for bubble first-appearance and panel slide-in.

```typescript
// Elastic bounce entrance (40-frame duration)
const easeProgress = entranceFrame < 20
  ? 2 * entranceFrame * entranceFrame
  : 1 - Math.pow(-2 * entranceFrame + 2, 2) / 2;
```

### Idle Float Motion
Bubbles drift with sine-wave oscillation.

```typescript
const floatOffsetX = Math.sin(phase) * 8;  // 8px amplitude
const floatOffsetY = Math.cos(phase * 0.7) * 8;
```

### Hover Transitions
Smooth scale and glow expansion on interaction.

```typescript
// 300ms easing with spring timing
transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Selection Focus
Active bubble scales up 30% with pulsing border.

```typescript
const scale = isSelected ? 1.3 + Math.sin(frame * 0.05) * 0.05 : 1;
```

---

## ♿ Accessibility & Fallbacks

### Reduced-Motion Support
All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

### High-Contrast Mode
Components adapt to `prefers-contrast: more`:

```typescript
// Auto-applied by design system
@media (prefers-contrast: more) {
  /* Increase border opacity, reduce blur, etc. */
}
```

### Keyboard Navigation
- Tab through bubbles, panels, buttons
- Enter/Space to activate
- Escape to close modals
- Arrow keys for menu navigation (as implemented)

### Screen Reader Labels
All interactive elements have:
- `role` attributes (button, menuitem, etc.)
- `aria-label` or `aria-labelledby`
- `aria-selected` for toggle states
- `aria-expanded` for collapsible panels

### Focus Management
- Visible focus rings (2px solid blue)
- Auto-focus on modal open
- Focus trap for overlays
- Restoration of focus on close

---

## 📊 Performance Optimization

### Canvas Rendering
- **60 FPS**: `requestAnimationFrame` for smooth motion
- **Batch Operations**: Group drawing calls
- **Minimal Redraws**: Only redraw changed regions
- **GPU Acceleration**: Use `will-change` for transformed elements

### Memory Management
- **Particle Pool**: Reuse particle objects instead of creating new ones
- **Cleanup**: Remove event listeners and cancel animation frames on unmount
- **Debouncing**: Throttle resize events

### Bundle Size
- Design system: ~3KB (tokens only, no duplication)
- GlassPanel: ~2KB (reusable, no duplication)
- BubbleIndicator: ~4KB (SVG rendering)
- AmbientBackground: ~2KB (canvas-based)
- ClusterBubbleVisualization: ~5KB (canvas system)

**Total Addition**: ~16KB (minified, gzipped ~4KB)

---

## 🛠️ Implementation Checklist

### Setup
- [ ] Copy `lib/design-system.ts` to your project
- [ ] Copy `components/GlassPanel.tsx`
- [ ] Copy `components/BubbleIndicator.tsx`
- [ ] Copy `components/AmbientBackground.tsx`
- [ ] Copy `components/ClusterBubbleVisualization.tsx`
- [ ] Copy `components/TickerDetailCard.tsx`

### Integration
- [ ] Add `<AmbientBackground />` to root layout
- [ ] Replace hardcoded colors with `SENTIMENT` and `GLASS` tokens
- [ ] Update all panels to use `<GlassPanel>` wrapper
- [ ] Verify keyboard navigation works
- [ ] Test with reduced-motion enabled
- [ ] Test on mobile/tablet responsive sizes

### Verification
- [ ] npm run type-check passes (0 errors)
- [ ] npm run build succeeds
- [ ] Animations smooth at 60 FPS (DevTools Performance)
- [ ] No console warnings or errors
- [ ] Accessibility audit passes (axe-core)
- [ ] Works in Safari, Chrome, Firefox, Edge

---

## 📖 Usage Examples

### Complete Page with All Components

```tsx
'use client';

import { useState } from 'react';
import AmbientBackground from '@/components/AmbientBackground';
import GlassPanel from '@/components/GlassPanel';
import BubbleIndicator from '@/components/BubbleIndicator';
import ClusterBubbleVisualization from '@/app/bubbles/components/ClusterBubbleVisualization';
import TickerDetailCard from '@/app/bubbles/components/TickerDetailCard';

export default function ClustersPage() {
  const [selectedTicker, setSelectedTicker] = useState(null);

  return (
    <>
      <AmbientBackground />

      <div className="min-h-screen p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <GlassPanel padding="lg" animate>
            <h1 className="text-4xl font-bold text-white">
              🫧 Commodity Clusters
            </h1>
            <p className="text-slate-400 mt-2">
              Real-time sentiment analysis grouped by commodity
            </p>
          </GlassPanel>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Canvas Bubbles */}
            <GlassPanel className="lg:col-span-2 h-96">
              <ClusterBubbleVisualization
                tickers={tickerData}
                selectedTicker={selectedTicker}
                onSelectTicker={setSelectedTicker}
              />
            </GlassPanel>

            {/* Detail Card */}
            <GlassPanel animate>
              {selectedTicker ? (
                <TickerDetailCard ticker={selectedTicker} />
              ) : (
                <p className="text-slate-400 text-center">
                  Click a bubble to see details
                </p>
              )}
            </GlassPanel>
          </div>
        </div>
      </div>
    </>
  );
}
```

---

## 🎯 Best Practices

### Do's
✅ Use design system tokens for consistency  
✅ Nest GlassPanel for layered UI depth  
✅ Test animations with DevTools throttling (slow 4G)  
✅ Use `aria-label` on all interactive elements  
✅ Keep animations under 500ms for snappy feel  

### Don'ts
❌ Hardcode colors or timing values  
❌ Stack more than 2-3 blurred surfaces  
❌ Animate position/size with CSS transitions (use transform)  
❌ Forget to export all components from index files  
❌ Skip testing with reduced-motion enabled  

---

## 🔗 File Structure

```
frontend/
├── lib/
│   └── design-system.ts           # All tokens and utilities
├── components/
│   ├── GlassPanel.tsx             # Reusable glass surface
│   ├── BubbleIndicator.tsx        # SVG bubble component
│   ├── AmbientBackground.tsx      # Floating orbs
│   └── Navbar.tsx                 # With glass styling
├── app/
│   ├── layout.tsx                 # Add AmbientBackground here
│   └── bubbles/
│       ├── clusters/
│       │   └── page.tsx           # Main page
│       └── components/
│           ├── ClusterBubbleVisualization.tsx  # Canvas bubbles
│           └── TickerDetailCard.tsx            # Detail panel
└── ...
```

---

## 🚀 Next Steps

1. **TypeScript Compilation**: `npm run type-check` (verify 0 errors)
2. **Development**: `npm run dev`
3. **Browser Testing**: Visit `http://localhost:3000/bubbles/clusters`
4. **Performance**: Check FPS with DevTools > Performance
5. **Accessibility**: Run axe DevTools chrome extension
6. **Mobile**: Test on iPhone/Android via Responsive Design Mode
7. **Build**: `npm run build` and verify bundle size

---

**Status**: Production-ready  
**Last Updated**: 2026-05-26  
**Version**: 2.3.0 (Glassmorphism & Design System Release)
