# CommodityBubbles Architecture

## **Tech Stack Decision: Next.js 14 + Supabase + Vercel**

### Why This Stack (vs React + FastAPI)?

| Aspect | Next.js + Supabase | React + FastAPI |
|--------|-------------------|-----------------|
| Setup time | 2 hours | 6 hours |
| Real-time | Supabase subscriptions (1 line) | WebSocket server + manage | 
| Database | Managed PostgreSQL | Self-managed Postgres |
| Auth | Built-in (NextAuth or Supabase) | DIY with JWT |
| Deployment | Single vercel deploy | 2 services (frontend + backend) |
| Cost | $0-50/mo | $40-100/mo |
| DevOps burden | None | Medium (server management) |
| Time to MVP | 4 weeks ✓ | 5-6 weeks |
| Scalability | Auto-scales with Vercel | Manage server sizing |

**Decision:** Next.js + Supabase wins for 4-week MVP. Same power, 20% faster development.

---

## **Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│  USERS (5 practice users + future customers)                │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴───────────┐
        │                        │
   ┌────▼────┐            ┌──────▼──────┐
   │ Vercel  │            │   Stripe    │
   │ (UI)    │            │ (Billing)   │
   └────┬────┘            └──────┬──────┘
        │                        │
        └────────────┬───────────┘
                     │
        ┌────────────▼───────────┐
        │  Next.js App Router    │
        │  (TypeScript)          │
        │                        │
        │  app/                  │
        │  ├── page.tsx          │
        │  ├── api/              │
        │  │   ├── signals/      │← Bot webhook endpoint
        │  │   └── auth/         │
        │  ├── dashboard/        │
        │  └── components/       │
        └────────────┬───────────┘
                     │
        ┌────────────▼───────────────┐
        │  Supabase PostgreSQL       │
        │  + Real-time Subscriptions │
        │                            │
        │  Tables:                   │
        │  • users (auth)            │
        │  • subscriptions (Stripe)  │
        │  • signals (bot data)      │
        │  • commodities (prices)    │
        │  • sentiment (news)        │
        └────────────┬───────────────┘
                     │
        ┌────────────┴───────────┐
        │                        │
   ┌────▼──────┐          ┌─────▼────┐
   │ Perplexity│          │ yfinance  │
   │ API       │          │ (prices)  │
   │ (news)    │          │           │
   └───────────┘          └───────────┘

┌─────────────────────────────────────────────────────────────┐
│  YOUR METALS AGENT (copper trading bot)                     │
│                                                             │
│  hourly_agent_runner.sh                                     │
│  ├── Fetch headlines                                        │
│  ├── Classify sentiment (Claude API)                        │
│  ├── Calculate edge (vs Polymarket)                         │
│  └── POST to webhook (loosely coupled)                      │
│      ↓                                                       │
│      POST /api/signals/ingest                               │
│      {sentiment: "bullish", confidence: 0.92, edge_pct: 40} │
│      ↓                                                       │
│      Stored in Supabase + broadcast to all connected users  │
└─────────────────────────────────────────────────────────────┘
```

---

## **Data Flow**

### 1. Sentiment → Signal → Broadcast

```
Your Metals Agent (Every Hour)
  ├─ Step 1: Fetch copper headlines
  ├─ Step 2: Sentiment analysis (Claude)
  ├─ Step 3: Edge detection (confidence vs Polymarket odds)
  └─ Step 4: POST to CommodityBubbles webhook
     
     POST /api/signals/ingest
     {
       sentiment: "bullish",
       confidence: 0.92,
       edge_pct: 40,
       commodity: "copper",
       timestamp: "2026-05-23T14:00:00Z"
     }
     ↓
CommodityBubbles Backend (Next.js API route)
  ├─ Validate request
  ├─ Store in Supabase (signals table)
  └─ Broadcast via real-time subscription
     ↓
User Dashboard (real-time update)
  ├─ "New signal: Bullish (0.92 confidence)"
  ├─ Bubble animation
  └─ Added to signal history
```

### 2. User Subscribes → Receives Updates

```
User clicks "Connect my bot"
  ↓
Provides bot webhook URL (optional, for future)
  ↓
CommodityBubbles listens on /api/signals/ingest
  ↓
Bot posts signal every hour
  ↓
Supabase real-time pushes to UI
  ↓
Dashboard updates live (no refresh needed)
```

### 3. Stripe Subscription → Access Control

```
User signs up
  ↓
Selects Plan (Pro $1/mo or Enterprise $25/mo)
  ↓
Stripe checkout → creates Stripe customer
  ↓
Webhook: subscription.created
  ↓
Set user.tier = "pro" or "enterprise" in DB
  ↓
Dashboard checks tier → unlocks features
```

---

## **Database Schema**

### Core Tables

```sql
-- Users
users (id, email, password_hash, tier, created_at, last_login)

-- Subscriptions (Stripe integration)
subscriptions (
  id, user_id, stripe_customer_id, stripe_subscription_id,
  tier, current_period_start, current_period_end, status
)

-- Commodities
commodities (id, name, symbol, hg_code, category)
  - copper (HG=F)
  - nickel (NI=F)
  - zinc (ZS=F)
  - gold (GC=F)

-- Signals (from bot)
signals (
  id, commodity_id, sentiment, confidence, edge_pct,
  timestamp, source, metadata
)

-- Sentiment (from news)
sentiments (
  id, commodity_id, headline, source, sentiment, score,
  published_at
)

-- Prices (historical)
prices (
  id, commodity_id, price, timestamp
)
```

---

## **API Endpoints (4-week MVP)**

### Public (No auth required)

```
POST /api/signals/ingest
  - Input: sentiment, confidence, edge_pct, commodity, timestamp
  - Output: { success: true, signal_id: "xyz" }
  - Used by: Your metals agent webhook
  - Rate limit: Unlimited (webhook integration)
```

### Authenticated (Stripe verified)

```
GET /api/signals/latest?commodity=copper
  - Returns: Last 10 signals
  - Auth: User JWT token

GET /api/dashboard/data
  - Returns: {bubbles, sentiment, prices, bot_signals}
  - Auth: User JWT token

GET /api/prices/history?commodity=copper&days=30
  - Returns: Historical price data
  - Auth: Pro+ only

GET /api/user/subscription
  - Returns: {tier, status, renews_at}
  - Auth: User JWT token
```

---

## **Real-Time Features (Supabase)**

### Bubble Map Updates

```typescript
// User connects to real-time subscription
const subscription = supabase
  .from('signals')
  .on('INSERT', (payload) => {
    // Bubble appears with animation
    addBubble(payload.new);
  })
  .subscribe();
```

### Price Updates

```typescript
// Prices update every minute
const priceSubscription = supabase
  .from('prices')
  .on('INSERT', (payload) => {
    // Bubble resizes based on new price
    updateBubbleSize(payload.new);
  })
  .subscribe();
```

---

## **Week-by-Week Architecture Buildout**

### Week 1: Foundation
- [ ] Auth system (email/password → Supabase)
- [ ] Database migrations (all tables created)
- [ ] Stripe integration skeleton
- [ ] Empty dashboard layout
- **Deliverable:** Login → dashboard (no data yet)

### Week 2: Bubble Map + Sentiment
- [ ] D3.js bubble component (physics simulation)
- [ ] WebSocket subscription (real-time updates)
- [ ] Sentiment aggregation (synthetic for MVP)
- [ ] Price feeds (yfinance API)
- **Deliverable:** Bubble map with 4 commodities, live price updates

### Week 3: News Pipeline + Bot Integration
- [ ] Perplexity API headlines
- [ ] Sentiment classification (Claude API)
- [ ] Webhook receiver (/api/signals/ingest)
- [ ] Signal display in UI
- **Deliverable:** Bot can post signals, they appear on dashboard

### Week 4: Stripe + Polish
- [ ] Stripe subscription checkout
- [ ] Feature gating (Pro vs Enterprise)
- [ ] Email receipts
- [ ] Mobile responsive
- **Deliverable:** Full MVP, ready for 5 test users

---

## **Deployment Pipeline**

```
Your Local Code
  ↓ (git push)
  ↓
GitHub (main branch)
  ↓ (webhook trigger)
  ↓
Vercel (automatic deploy)
  ├─ Run npm run build
  ├─ Run db migrations
  └─ Deploy to vercel.app
  ↓
Supabase (connected)
  ├─ Real-time subscriptions ready
  └─ Database live
  ↓
Stripe (production keys)
  ├─ Webhooks ready
  └─ Checkout flow live
```

**Result:** Every git push = live update (after 2-3 min build)

---

## **Sellable to Other Companies**

### What You're Building
1. **White-label ready:** UI can show customer's branding
2. **Pluggable bot integration:** Any bot can POST to /api/signals/ingest
3. **Subscription management:** Stripe handles all billing
4. **Extensible:** New data sources (not just your bot)

### Future Enterprise Customer Could
- Add their own bot signals
- Customize bubble color scheme
- Brand it with their name
- Lock data sources they care about
- Charge their own users

---

## **Performance Notes**

**Real-time latency:** <500ms (Supabase subscriptions)  
**Bubble rendering:** 60fps (D3.js optimized)  
**API response:** <200ms (Vercel edge caching)  
**Database:** Auto-scaling (Supabase managed)  
**Cost at 1000 users:** ~$50-100/mo (all-in)

---

**Status:** Architecture finalized. Ready to build Week 1.
