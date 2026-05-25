# CommodityBubbles — Quick Start Guide

**Build Timeline:** 4 weeks | **MVP Ready:** Week 4 | **Target Users:** 5 practice users

---

## **One-Time Setup (15 minutes)**

### 1. Install Dependencies
```bash
cd ~/Desktop/Metals\ Agent\ Appv1/
npm install -g vercel
npm install -g supabase
```

### 2. Vercel Account Setup
```bash
vercel login
# Authenticate and create project
```

### 3. Supabase Project
```bash
# Create at supabase.com -> New Project
# Get credentials:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

### 4. Stripe Keys
```bash
# Get from stripe.com dashboard:
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# - STRIPE_SECRET_KEY
```

### 5. Configure Environment
```bash
cp frontend/.env.local.example frontend/.env.local
# Fill in all keys from above
```

### 6. Deploy Database
```bash
cd frontend/
npm run db:push
# Creates all tables in Supabase
```

---

## **Local Development (Weekly)**

```bash
cd ~/Desktop/Metals\ Agent\ Appv1/frontend/

# Start dev server
npm run dev
# → http://localhost:3000

# Watch for code changes
# Browser auto-refreshes

# Test API locally
curl -X POST http://localhost:3000/api/signals/ingest \
  -H "Content-Type: application/json" \
  -d '{"sentiment":"bullish","confidence":0.92,"edge_pct":40,"commodity":"copper"}'
```

---

## **Deploy to Vercel (One-click)**

```bash
# Auto-deployment on git push, OR:
vercel deploy --prod
```

---

## **Connect Your Metals Agent**

In `hourly_agent_runner.sh`, add after each decision:

```bash
curl -X POST https://your-vercel-app.vercel.app/api/signals/ingest \
  -H "Content-Type: application/json" \
  -d "{
    \"sentiment\":\"$SENTIMENT\",
    \"confidence\":$CONFIDENCE,
    \"edge_pct\":$EDGE,
    \"commodity\":\"copper\",
    \"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
  }"
```

---

## **Week-by-Week Checklist**

### Week 1: Foundation
- [ ] Vercel + Supabase + Stripe setup
- [ ] Database migrations (users, commodities, signals, subscriptions)
- [ ] Auth system (email/password login)
- [ ] Basic dashboard page (empty bubble map)

### Week 2: Bubble Map + Sentiment
- [ ] D3.js bubble component
- [ ] WebSocket real-time updates
- [ ] Sentiment aggregation (synthetic data for MVP)
- [ ] Price feeds (yfinance)
- [ ] Mobile responsive

### Week 3: News Pipeline + Bot Integration
- [ ] Perplexity API headlines
- [ ] Sentiment classification (Claude API)
- [ ] Webhook receiver (/api/signals/ingest)
- [ ] Display bot signals in UI

### Week 4: Stripe + Polish + Launch
- [ ] Stripe subscription flow
- [ ] Email receipts
- [ ] Analytics (basic)
- [ ] Deploy to production
- [ ] Soft launch (5 friends)

---

## **File Structure**

```
Metals Agent Appv1/
├── QUICK_START.md (this file)
├── 01_ARCHITECTURE.md (tech stack details)
├── 02_API_SCHEMA.md (all endpoints)
├── 03_DEPLOYMENT.md (step-by-step deploy)
├── 04_BOT_INTEGRATION.md (how to connect metals agent)
├── frontend/ (Next.js app)
│   ├── package.json
│   ├── .env.local.example
│   ├── app/
│   │   ├── page.tsx (home)
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── api/
│   │   └── components/
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── stripe.ts
│   │   └── types.ts
│   └── public/
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## **Key Commands**

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production

# Database
npm run db:push              # Apply migrations to Supabase
npm run db:pull              # Pull schema from Supabase

# Deploy
vercel deploy --prod         # Deploy to Vercel

# Type checking
npm run type-check           # Check TypeScript errors

# Testing
npm run lint                 # Check code style
```

---

## **Getting Help**

- **Architecture questions:** See `01_ARCHITECTURE.md`
- **API endpoints:** See `02_API_SCHEMA.md`
- **Deployment stuck:** See `03_DEPLOYMENT.md`
- **Bot integration:** See `04_BOT_INTEGRATION.md`

---

**Ready? Start with:** `npm install` → `npm run dev` → open http://localhost:3000
