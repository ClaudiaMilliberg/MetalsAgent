# Metals Agent UI Upgrade & Deployment Work Log

**Project**: Bloomberg-quality UI upgrade + Vercel deployment  
**Start Time**: 2026-05-27 16:30 UTC  
**Definition of Done**: Build succeeds, Vercel green, visual changes live, no console errors

---

## PHASE 1: RESEARCH ✅ COMPLETE
- [x] Bloomberg Terminal: data-dense, monospace, multi-layer hierarchy, CVD-accessible colors (amber accents, not just red/green)
- [x] TradingView: dark theme with muted palette, soft grays, subtle shadows, intuitive navigation
- [x] DeFiLlama/CoinMarketCap: crypto aesthetic with neon accents, minimalist layout, bright contrast
- [x] Glassmorphism 2026: NOT macOS-style. Dark glassmorphism = layered semi-transparent surfaces over vibrant deep gradients
- [x] Neon terminals (Signal/DevOps): JetBrains Mono, near-black palette, neon-green semantics
- [x] shadcn/ui + Framer Motion: Motion Primitives, Aceternity UI, 20+ dark mode components

**Key Insights**:
- Deep matte navy-black (not flat gray) with layered gradients
- Glassmorphism = backdrop-blur-xl, border-white/10, shadow-2xl with color
- Neon accents on dark = cyan, lime-green, orange on #0a0e1a
- Monospace typography for prices (JetBrains Mono)
- Framer Motion micro-interactions on hover/select

---

## PHASE 2: DESIGN PATTERNS EXTRACTED ✅ COMPLETE

| Pattern | Implementation for Metals Agent |
|---------|----------------------------------|
| **Background** | #0a0e1a (deep navy-black) with subtle radial gradients behind bubbles |
| **Glassmorphism** | backdrop-blur-xl, border-white/10, shadow-2xl #000/30 |
| **Neon Accents** | Copper=orange, Gold=yellow, Uranium=cyan, Lithium=lime, Palladium=purple |
| **Typography** | Prices: 5-6xl monospace, Titles: Inter bold, Labels: JetBrains Mono sm |
| **Motion** | Framer Motion: hover scale 1.05, glow pulse, entrance slide-in |
| **Tabs** | Lucide icons + label, active state = accent bar + glow ring + lift |
| **Bubbles** | 7-layer depth: outer glow + bloom + core + shadow + parallax |

---

## PHASE 3: APP AUDIT ✅ COMPLETE

**Current State**:
- ✅ JetBrains Mono font loaded
- ✅ Dark mode (#0F172A) set as default
- ✅ Canvas-based bubble visualization exists
- ✅ Commodity glow colors defined (orange, blue, white, purple)
- ❌ Background is too flat, lacks ambient glow field
- ❌ Bubbles lack 7-layer depth effects
- ❌ Glass panels not using proper glassmorphism (blur/border/shadow)
- ❌ Tabs use emojis, not Lucide icons
- ❌ Prices not large/monospaced enough
- ❌ No Framer Motion micro-interactions
- ❌ No neon accent colors in palette

**Gaps**: Deep background, bubble glow, glassmorphism, icon tabs, typography scaling, motion

---

## PHASE 4: IMPLEMENTATION

### BLOCK 1: Background & Atmosphere
- [ ] Upgrade #0F172A to #0a0e1a (deeper black)
- [ ] Add radial gradient field behind bubbles
- [ ] Add subtle ambient glow zones
- [ ] Create layered background effect

### BLOCK 2: Bubble Depth & Glow
- [ ] Enhance canvas bubble rendering with glow bloom
- [ ] Add sentiment-controlled light intensity
- [ ] Add parallax effect on mouse move
- [ ] Test selected bubble light casting

### BLOCK 3: Glass Panels & Detail Cards
- [ ] Upgrade BubbleDetailCard with glassmorphism
- [ ] Add backdrop-blur-xl + border-white/10
- [ ] Add shadow-2xl with color
- [ ] Animate panel entrance/exit

### BLOCK 4: Tabs & Navigation
- [ ] Replace emoji with Lucide icons
- [ ] Add active-state glow ring
- [ ] Add accent bar animation
- [ ] Add lift on hover (translate-y)

### BLOCK 5: Typography & Data
- [ ] Upgrade price font size to 5-6xl
- [ ] Ensure monospace for all prices
- [ ] Add proper spacing between number/unit
- [ ] Verify English-only headlines

### BLOCK 6: Motion & Polish
- [ ] Add Framer Motion to commodity cards
- [ ] Add hover scale + glow
- [ ] Add entrance animations
- [ ] Add reduced-motion support

---

## DEPLOYMENT CHECKLIST
- [ ] All 6 blocks implemented
- [ ] Build: `npm run build` passes
- [ ] No Tailwind opacity errors (bg-white/8 → bg-white/10)
- [ ] Git push to main
- [ ] Vercel deployment triggered
- [ ] Hard refresh verifies visual changes
- [ ] Console: no errors

---

## PROGRESS
- Phase 1: ✅
- Phase 2: ✅
- Phase 3: ✅
- Phase 4: 🚀 IN PROGRESS
- Phase 5: ⏳ PENDING

