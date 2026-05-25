# CommodityBubbles MVP — Complete Project Scaffold

**Status:** ✅ Project scaffold complete. Ready to build Week 1.

**Timeline:** 4 weeks to production  
**Target Users:** 5 practice users (then sell to enterprises)  
**Tech Stack:** Next.js 14 + Supabase + Vercel + Stripe  

---

## **What's Included**

This scaffold includes everything you need to launch CommodityBubbles in 4 weeks:

### 📄 Documentation (Week 1)
- ✅ **QUICK_START.md** — 15-minute setup guide
- ✅ **01_ARCHITECTURE.md** — Tech stack decision + diagrams
- ✅ **02_API_SCHEMA.md** — All endpoints documented
- ✅ **03_DEPLOYMENT.md** — Step-by-step Vercel/Supabase setup
- ✅ **04_BOT_INTEGRATION.md** — How to connect your metals agent

### 💻 Frontend Scaffold (React + TypeScript)
- ✅ **package.json** — All dependencies pre-configured
- ✅ **next.config.js** — Next.js 14 setup
- ✅ **tsconfig.json** — TypeScript strict mode
- ✅ **tailwind.config.js** — Dark theme + custom colors
- ✅ **app/layout.tsx** — Root layout
- ✅ **app/page.tsx** — Landing page (fully styled)
- ✅ **app/globals.css** — Global styles + animations
- ✅ **lib/types.ts** — Type definitions (User, Signal, Commodity, etc.)
- ✅ **lib/supabase.ts** — Supabase client + helpers

### 🔌 API Routes (Ready to Implement)
- ✅ **app/api/signals/ingest/route.ts** — Webhook for bot signals (IMPLEMENTED)
- ✅ **app/api/health/route.ts** — Health check (IMPLEMENTED)
- 🔲 app/api/auth/signup/route.ts — (Week 1)
- 🔲 app/api/auth/login/route.ts — (Week 1)
- 🔲 app/api/dashboard/data/route.ts — (Week 2)
- 🔲 app/api/signals/latest/route.ts — (Week 2)
- 🔲 app/api/prices/history/route.ts — (Week 2)
- 🔲 app/api/checkout/route.ts — (Week 4)
- 🔲 app/api/webhooks/stripe/route.ts — (Week 4)

### 🗄️ Database (Supabase)
- ✅ **supabase/migrations/001_initial_schema.sql** — Complete schema
  - users (Supabase Auth integration)
  - subscriptions (Stripe integration)
  - commodities (copper, nickel, zinc, gold)
  - signals (from bot)
  - sentiments (from news)
  - prices (historical)
  - Real-time subscriptions enabled
  - Row-level security configured
  - Indexes + views pre-built

### 🚀 Deployment
- ✅ **.github/workflows/deploy.yml** — Auto-deploy on push to main
- ✅ **frontend/postcss.config.js** — Tailwind build config

---

## **Quick Start (5 minutes)**

```bash
# Clone this folder (already downloaded)
cd ~/Desktop/Metals\ Agent\ Appv1/

# 1. Install dependencies
cd frontend/
npm install

# 2. Copy environment template
cp .env.local.example .env.local
# Fill in your Supabase/Stripe keys

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

**You should see:**
- Landing page with pricing
- Sign In / Sign Up buttons
- Feature cards

---

## **Week-by-Week Build Plan**

### Week 1: Foundation (Auth + DB + Layout)
**Goal:** Users can login, see empty dashboard  
**Tasks:**
- [ ] Setup Vercel + Supabase + Stripe accounts (30 min)
- [ ] Run database migrations (5 min)
- [ ] Implement /api/auth/signup (2 hours)
- [ ] Implement /api/auth/login (2 hours)
- [ ] Create /app/dashboard/page.tsx layout (1 hour)
- [ ] Deploy to Vercel (30 min)

**Deliverable:** Login works, dashboard loads (no data yet)

---

### Week 2: Bubble Map + Real-Time
**Goal:** Bubble map renders, real-time price updates  
**Tasks:**
- [ ] Create BubbleMap.tsx component with D3.js (4 hours)
- [ ] Implement WebSocket subscription (2 hours)
- [ ] Create /api/dashboard/data endpoint (2 hours)
- [ ] Create /api/signals/latest endpoint (1 hour)
- [ ] Create /api/prices/history endpoint (1 hour)
- [ ] Implement price feed (yfinance API) (2 hours)

**Deliverable:** Bubble map renders, updates in real-time when prices change

---

### Week 3: News + Bot Integration
**Goal:** AI sentiment pipeline, bot signals appear on dashboard  
**Tasks:**
- [ ] Integrate Perplexity API for headlines (2 hours)
- [ ] Sentiment classification (Claude API) (2 hours)
- [ ] Create headline display component (1 hour)
- [ ] Test /api/signals/ingest endpoint (1 hour)
- [ ] Connect your metals agent webhook (30 min)
- [ ] Create signal history component (1 hour)

**Deliverable:** Bot signals appear on dashboard in real-time

---

### Week 4: Stripe + Polish + Launch
**Goal:** Full MVP with payments, ready for 5 test users  
**Tasks:**
- [ ] Implement /api/checkout route (1 hour)
- [ ] Implement /api/webhooks/stripe route (2 hours)
- [ ] Create subscription UI component (2 hours)
- [ ] Feature gating (Pro vs Enterprise) (1 hour)
- [ ] Mobile responsive polish (2 hours)
- [ ] Analytics & monitoring setup (1 hour)
- [ ] Deploy to production (30 min)

**Deliverable:** Full MVP, Stripe checkout works, 5 users can pay

---

## **Key Implementation Notes**

### Authentication
- Using Supabase Auth (email/password)
- JWT tokens stored in localStorage
- Middleware to check auth on protected routes

### Real-Time
- Supabase subscriptions (no separate WebSocket server)
- Subscribe to `signals` table INSERT events
- Subscribe to `prices` table INSERT events
- Automatic broadcast to all connected users

### Bot Integration
- No authentication required (loosely coupled)
- Bot POSTs to `/api/signals/ingest` webhook
- Signals stored automatically, broadcast via real-time
- See `04_BOT_INTEGRATION.md` for exact format

### Payments
- Stripe products already created ($1/mo Pro, $25/mo Enterprise)
- Subscription webhook validates payments
- User tier controls feature access
- Data: Metadata check on every request

### Styling
- TailwindCSS dark theme (dark blue background #0F172A)
- Custom colors: bullish (#10B981), bearish (#EF4444), neutral (#F59E0B), accent (#06B6D4)
- Glassmorphism effects (backdrop blur + semi-transparent)
- Smooth animations (Framer Motion ready)

---

## **Development Workflow**

### Local Development
```bash
cd frontend/
npm run dev
# http://localhost:3000

# In another terminal, test webhook
curl -X POST http://localhost:3000/api/signals/ingest \
  -d '{"sentiment":"bullish","confidence":0.92,"edge_pct":40,"commodity":"copper"}'
```

### Type Checking
```bash
npm run type-check  # Verify no TypeScript errors
```

### Deploying
```bash
git add .
git commit -m "Feature: add bubble map"
git push origin main
# → Auto-deploys to Vercel (via GitHub Actions)
```

---

## **File Structure Reference**

```
Metals Agent Appv1/
├── README.md                          ← You are here
├── QUICK_START.md
├── 01_ARCHITECTURE.md
├── 02_API_SCHEMA.md
├── 03_DEPLOYMENT.md
├── 04_BOT_INTEGRATION.md
├── .github/workflows/
│   └── deploy.yml                     ← Auto-deploy config
├── frontend/
│   ├── package.json                   ← Dependencies
│   ├── .env.local.example             ← Environment template
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── app/
│   │   ├── layout.tsx                 ← Root layout
│   │   ├── page.tsx                   ← Landing page ✅
│   │   ├── globals.css                ← Global styles
│   │   ├── api/
│   │   │   ├── signals/
│   │   │   │   └── ingest/
│   │   │   │       └── route.ts       ← Bot webhook ✅
│   │   │   ├── health/
│   │   │   │   └── route.ts           ← Health check ✅
│   │   │   ├── auth/                  ← (To build Week 1)
│   │   │   ├── dashboard/             ← (To build Week 2)
│   │   │   ├── checkout/              ← (To build Week 4)
│   │   │   └── webhooks/              ← (To build Week 4)
│   │   ├── dashboard/                 ← (To build Week 1)
│   │   └── components/                ← (To build Week 2+)
│   ├── lib/
│   │   ├── types.ts                   ← Type definitions
│   │   └── supabase.ts                ← Supabase client
│   └── public/                        ← Images/static files
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql     ← Database schema
```

---

## **Next Steps**

### Now (Do This First)
1. Read **QUICK_START.md** (5 min)
2. Read **03_DEPLOYMENT.md** (10 min)
3. Create Supabase account + get credentials
4. Create Stripe account + get API keys
5. Fill in `.env.local`
6. Run `npm install` + `npm run dev`

### Then
1. Test landing page loads at http://localhost:3000
2. Test webhook: `curl http://localhost:3000/api/signals/ingest`
3. Test health: `curl http://localhost:3000/api/health`

### This Week (Week 1 Dev)
1. Implement auth routes (/api/auth/signup, /api/auth/login)
2. Create /app/dashboard layout
3. Deploy to Vercel
4. Test in production

### Connecting Your Bot
Once /api/signals/ingest works, update your `hourly_agent_runner.sh` (see `04_BOT_INTEGRATION.md`)

---

## **Support Reference**

| Question | Answer |
|----------|--------|
| "How do I deploy?" | See `03_DEPLOYMENT.md` |
| "What API endpoints exist?" | See `02_API_SCHEMA.md` |
| "How do I connect my bot?" | See `04_BOT_INTEGRATION.md` |
| "How does the architecture work?" | See `01_ARCHITECTURE.md` |
| "How do I run locally?" | See `QUICK_START.md` |
| "What's the database schema?" | See `supabase/migrations/001_initial_schema.sql` |

---

## **Success Criteria (End of Week 4)**

- [ ] Users can signup/login
- [ ] Dashboard loads (even if empty)
- [ ] Bubble map renders with 4 commodities
- [ ] Prices update in real-time
- [ ] Your bot can POST signals to /api/signals/ingest
- [ ] Signals appear on dashboard live
- [ ] Stripe checkout works
- [ ] Users can select Pro or Enterprise tier
- [ ] Feature gating works (Pro gets limited history, Enterprise gets all)
- [ ] App deployed to production on Vercel
- [ ] 5 test users can signup and explore

---

## **Pricing (Locked)**

- **Pro:** $1/month — Real-time bubbles, signals, sentiment
- **Enterprise:** $25/month — All Pro features + 2-year history + API access
- **Free tier:** None (no free users to manage initially)

---

## **Timeline Estimate**

| Week | Build | Effort | Status |
|------|-------|--------|--------|
| 1 | Auth + Dashboard | 15 hours | ⏳ Pending |
| 2 | Bubble Map | 12 hours | ⏳ Pending |
| 3 | News + Bot Integration | 10 hours | ⏳ Pending |
| 4 | Stripe + Polish | 10 hours | ⏳ Pending |
| **Total** | **MVP Complete** | **~47 hours** | ⏳ Pending |

---

## **Questions?**

- **Architecture decision?** → Read `01_ARCHITECTURE.md`
- **How to deploy?** → Read `03_DEPLOYMENT.md`
- **API endpoints?** → Read `02_API_SCHEMA.md`
- **Bot integration?** → Read `04_BOT_INTEGRATION.md`
- **Development setup?** → Read `QUICK_START.md`

---

**Everything is ready. Time to build! 🚀**

**Start here:** `QUICK_START.md` → Setup → `npm run dev` → Build Week 1
