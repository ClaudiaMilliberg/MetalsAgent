# 🎯 Metals Agent App - Product Redesign

## From Bot Signal Viewer → Commodity Intelligence Platform

**Vision:** A beautiful, real-time dashboard for tracking commodity prices, social sentiment, infrastructure projects, and supply chain disruptions.

---

## 📊 New Product Concept

### What Users See

**Home Dashboard** (Real-time, auto-updating)
- Live commodity prices (copper, nickel, zinc, gold)
- 24-hour price sparklines with trend indicators
- Social sentiment "murmurs" (scarcity mentions, news)
- Active infrastructure projects affecting supply
- Global supply chain heat map

**Four Main Views**

### 1. **Price Tracking** (Real-time ticker)
Inspired by: Finance app with chart interactions

Features:
- Live price cards for each commodity
- 1h/1d/1w/1m/1y price charts (interactive)
- Buy/sell pressure indicators
- Historical low/high markers
- Price alerts (Premium feature)

### 2. **Sentiment & News** (Social intelligence)
Inspired by: Social media feeds with real-time updates

Features:
- Twitter/Reddit mentions of "copper shortage"
- News articles about supply disruptions
- Sentiment score (-1 to +1, color-coded)
- Comment threads (why is this trending?)
- Trending topics in commodities
- Influencer analysis

### 3. **Supply Chain Projects** (Infrastructure tracking)
Inspired by: Project management dashboards

Features:
- New mining projects opening/closing
- Infrastructure builds (highways, ports)
- Environmental regulations
- Geopolitical events (trade wars, sanctions)
- Timeline view of upcoming events
- Impact predictions (price could rise 15% if...)

### 4. **Risk Dashboard** (Portfolio view)
Inspired by: Crypto portfolio trackers with risk scoring

Features:
- Market risk scores (0-100)
- Volatility heatmap
- Correlation matrix (which commodities move together?)
- Supply chain risk zones (red = high risk)
- Geopolitical risk map
- Recommendation engine

---

## 🎨 Visual Design System

### Color Palette
```
Primary:     #0066FF (Blue - trust, data)
Accent:      #FF6B35 (Orange - commodities, earth)
Success:     #10B981 (Green - rising prices)
Warning:     #F59E0B (Amber - caution)
Danger:      #EF4444 (Red - falling prices)
Dark:        #0F172A (Slate-950 - dark theme)
Neutral:     #64748B (Slate-500 - text)
```

### Typography
- Headlines: Bold, geometric
- Data: Monospace numbers (for precision)
- Callouts: Rounded, friendly

### Components

#### 1. Price Card
```
┌─────────────────────────────────┐
│  Copper (Cu)          $4.23     │
│  ████████░░ 1h: +2.3%           │
│  Buy: $4.20  Sell: $4.26        │
│  24h: $4.18 - $4.29             │
└─────────────────────────────────┘
```

#### 2. Sentiment Widget
```
┌─────────────────────────────────┐
│  📈 "Nickel shortage" trending   │
│  ❤️ 1,234 | 💬 89 | 📤 456      │
│  Sentiment: BULLISH (+0.78)     │
│  🔥 Emerging 2h ago             │
└─────────────────────────────────┘
```

#### 3. Project Timeline
```
┌─────────────────────────────────┐
│  🏗️ New Mine: Zambia            │
│  Status: Under Development      │
│  Opens: Q3 2026 (+12 months)    │
│  Production: 50,000 tons/year   │
│  Impact: ↓ 5-8% copper price    │
└─────────────────────────────────┘
```

#### 4. Risk Score
```
┌─────────────────────────────────┐
│  🛑 Supply Chain Risk: 72/100   │
│  🔴🔴🔴🔴🔴🟡⚪⚪⚪⚪            │
│  Drivers:                        │
│  • Port congestion (Mumbai)     │
│  • Mine strikes (Peru)          │
│  • Sanctions (Russia)           │
└─────────────────────────────────┘
```

---

## 📈 Dashboard Layout (Mobile-First)

### Main View (iOS-Inspired)
```
[Header: "Commodities" + Watchlist Icon]

[Live Price Ticker - 4 cards, swipeable]
  ┌─────────┐ ┌─────────┐
  │ Cu $4.23│ │ Ni $8.45│
  │ +2.3%   │ │ -0.8%   │
  └─────────┘ └─────────┘
  
[Sentiment Feed - scrollable]
  🔥 "Copper shortage fears" ↑↑↑
  ⚠️  "Port delays at Shanghai"
  📰 "Mining strike in Peru"
  
[Supply Chain Projects - cards]
  🏗️ Zambia Mine: Q3 2026
  🏗️ India Rail: Q4 2025
  
[Risk Dashboard Card]
  Supply Risk: 72/100 🛑
  
[Bottom Nav: Home | Sentiment | Projects | Risk]
```

---

## 🗄️ New Data Model

### Commodities Table
```sql
CREATE TABLE commodities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  current_price DECIMAL,
  price_1h DECIMAL,
  price_24h DECIMAL,
  updated_at TIMESTAMP,
  
  -- Market data
  buy_pressure INTEGER,
  sell_pressure INTEGER,
  volatility_score DECIMAL,
  
  -- Supply metrics
  global_reserves BIGINT,
  annual_production BIGINT,
  annual_demand BIGINT,
  supply_gap DECIMAL,
  
  UNIQUE(symbol)
);
```

### Sentiment Posts Table
```sql
CREATE TABLE sentiment_posts (
  id UUID PRIMARY KEY,
  commodity_id TEXT REFERENCES commodities(id),
  source TEXT, -- twitter, reddit, news
  content TEXT,
  author TEXT,
  sentiment_score DECIMAL (-1 to 1),
  engagement INTEGER,
  created_at TIMESTAMP,
  extracted_keywords TEXT[],
  is_trending BOOLEAN,
  
  INDEX (commodity_id, created_at DESC),
  INDEX (sentiment_score DESC)
);
```

### Supply Chain Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  commodity_id TEXT REFERENCES commodities(id),
  name TEXT NOT NULL,
  type TEXT, -- mining, infrastructure, regulation
  location TEXT,
  status TEXT, -- planning, construction, operation, closed
  start_date DATE,
  completion_date DATE,
  description TEXT,
  
  -- Impact prediction
  expected_production BIGINT,
  estimated_impact_percentage DECIMAL,
  confidence_score DECIMAL,
  
  created_at TIMESTAMP,
  INDEX (commodity_id, completion_date)
);
```

### Risk Factors Table
```sql
CREATE TABLE risk_factors (
  id UUID PRIMARY KEY,
  commodity_id TEXT REFERENCES commodities(id),
  category TEXT, -- geopolitical, weather, strike, regulation
  title TEXT,
  description TEXT,
  severity INTEGER (1-10),
  likelihood INTEGER (1-10),
  affected_regions TEXT[],
  
  -- Impact on price
  predicted_price_change DECIMAL,
  confidence DECIMAL,
  
  created_at TIMESTAMP,
  expires_at TIMESTAMP
);
```

### User Watchlist Table
```sql
CREATE TABLE watchlists (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  commodity_id TEXT REFERENCES commodities(id),
  price_alert_above DECIMAL,
  price_alert_below DECIMAL,
  sentiment_alert BOOLEAN,
  created_at TIMESTAMP,
  
  UNIQUE(user_id, commodity_id)
);
```

---

## 🎬 Week-by-Week Implementation

### Week 1: Foundation & Authentication
**Goal:** User can create account and see empty dashboard

- ✅ Auth (signup/login) - from WEEK1_AUTH_IMPLEMENTATION.md
- New: Commodity card component
- New: Basic price display (static data)
- Database: Create commodities table, populate with 4 metals
- Deploy to Vercel

**Deliverable:** Users can login and see 4 commodity cards with placeholder prices

---

### Week 2: Live Price Data & Real-time Updates
**Goal:** Live prices updating every 60 seconds

**Tasks:**
1. Create price data source (API integration)
   - Option A: Alpha Vantage API (free tier)
   - Option B: Twelve Data API
   - Option C: Mock real-time with WebSocket simulator

2. Implement real-time subscriptions
   - Supabase real-time for price updates
   - WebSocket listener in frontend
   - Auto-refresh chart data

3. Build price components
   - Price ticker card with trend arrow
   - Interactive price chart (D3.js or Chart.js)
   - 1h/1d/1w/1m timeframes
   - Buy/sell pressure indicators

4. Add price alerts
   - User can set high/low alerts
   - Toast notifications when triggered
   - Alert history

**Deliverable:** Real-time price dashboard with interactive charts

---

### Week 3: Sentiment Analysis & News Feed
**Goal:** Social sentiment and news integration

**Tasks:**
1. Data sources
   - Twitter API (x.com) for mentions
   - Reddit API for discussions
   - News API for articles
   - Aggregate into sentiment_posts table

2. Sentiment analysis
   - NLP sentiment scoring (-1 to +1)
   - Extract keywords (shortage, mine, supply, etc.)
   - Trend detection (is this rising?)
   - Use: transformers.js (in-browser NLP)

3. Frontend components
   - Sentiment feed (like Twitter)
   - Trending topics (word cloud)
   - News carousel
   - Sentiment heatmap (visualize mood)

4. Engagement metrics
   - Like/retweet counts
   - Comment threads (expandable)
   - Share buttons

**Deliverable:** Real-time social sentiment dashboard

---

### Week 4: Supply Chain & Projects
**Goal:** Track infrastructure projects and their price impact

**Tasks:**
1. Data sources
   - Mining industry news
   - Government announcements
   - Port/shipping reports
   - Manually curated project database

2. Project tracking
   - Timeline view (Gantt-style)
   - Status indicators
   - Impact predictions
   - Map view (show locations)

3. Components
   - Project cards with timeline
   - Impact calculator (if mine opens, price ↓ X%)
   - Calendar view
   - Alert on status changes

4. Notifications
   - Push notifications for major events
   - Email digest (weekly)

**Deliverable:** Supply chain intelligence dashboard

---

### Week 5: Risk Dashboard & Recommendations
**Goal:** Holistic risk view and intelligence insights

**Tasks:**
1. Risk scoring
   - Aggregate sentiment + projects + geopolitics
   - Calculate supply chain risk (0-100)
   - Volatility metrics
   - Correlation analysis

2. Heatmaps & visualizations
   - Risk heatmap by region
   - Commodity correlation matrix
   - Volatility trend
   - Supply vs demand gap

3. Recommendations engine
   - "Watch copper - new mine opening Q3"
   - "High volatility expected next month"
   - "Nickel prices likely to rise"

4. Premium features
   - Price prediction (ML model)
   - Custom alerts
   - Export reports
   - API access

**Deliverable:** Enterprise risk dashboard

---

### Week 6: Mobile Optimization & Polish
**Goal:** Beautiful, production-ready app

- Mobile-first responsive design
- Dark theme perfection
- Animation polish
- Performance optimization
- Test coverage

**Deliverable:** Ship to production

---

## 🔌 Data Integration Strategy

### Price Data Source
**Recommended: Twelve Data API** (Free tier: 800 API calls/day)
```
GET /timeseries?symbol=COPPER&interval=1h
→ Returns: open, high, low, close, volume
```

### Social Data
**Twitter API (v2)** - Search recent tweets
```
Query: ("copper shortage" OR "nickel supply") -is:retweet
→ Returns: text, author, engagement, created_at
```

**Reddit API** - Get posts from r/stocks, r/investing
```
Subreddit: stocks, search: copper
→ Returns: title, selftext, score, comments
```

**News API** - General commodity news
```
Query: "copper mining" OR "nickel price"
→ Returns: title, description, source, url
```

### Project Data
**Sources:**
- Mining company announcements
- Government press releases
- Industry databases
- News aggregation
- Manually curated seed data

---

## 💰 Monetization Strategy

### Free Tier
- Live prices (60s delay)
- Social sentiment feed
- Basic project tracking
- Web app

### Pro Tier ($4.99/month)
- Real-time prices (0s delay)
- Custom price alerts
- Advanced sentiment analytics
- Email digest
- API access (100 calls/day)

### Enterprise Tier ($49/month)
- Everything in Pro
- Real-time API (unlimited)
- Custom reports
- Webhook integration
- Priority support
- Custom data feeds

---

## 🛠️ Tech Stack Updates

| Component | Technology | Why |
|-----------|-----------|-----|
| Charts | D3.js v7 | Complex interactive charts (already in package.json) |
| Maps | Mapbox GL | Beautiful geopolitical risk visualization |
| Real-time | Supabase | WebSocket subscriptions for live updates |
| NLP | transformers.js | Browser-based sentiment analysis |
| Notifications | Firebase Cloud Messaging | Push notifications |
| State | TanStack Query | Real-time data synchronization |
| UI | shadcn/ui | Beautiful, pre-built components |

---

## 📱 Mobile-First Design Specs

### Screen Sizes
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1440px

### Touch-Friendly
- 44px minimum tap targets
- Gesture support (swipe between commodities)
- Pull-to-refresh for price updates
- Bottom navigation bar (always accessible)

### Dark Theme
- Background: #0F172A (slate-950)
- Cards: #1E293B (slate-800)
- Text: #F1F5F9 (slate-100)
- Accent: #0066FF (blue)

---

## 🎯 Success Metrics

### Week 1
- [ ] Users can sign up
- [ ] Dashboard loads
- [ ] No errors in console

### Week 2
- [ ] Price updates in real-time
- [ ] Charts interactive
- [ ] Average load time < 2s

### Week 3
- [ ] 50+ sentiment posts per day
- [ ] Trending topics visible
- [ ] Sentiment score accuracy > 80%

### Week 4
- [ ] 50+ projects tracked
- [ ] Impact predictions reasonable
- [ ] Users setting alerts

### Week 5
- [ ] Risk score correlates with volatility
- [ ] Recommendations useful
- [ ] NPS score > 40

### Week 6
- [ ] Mobile UI perfect
- [ ] Performance: LCP < 1.5s
- [ ] Core Web Vitals: Green

---

## 🚀 Launch Timeline

```
Week 1: Auth + Basic Dashboard
Week 2: Real-time Prices
Week 3: Sentiment Feed
Week 4: Supply Chain Projects
Week 5: Risk Dashboard
Week 6: Mobile + Launch

Total: 6 weeks to MVP
Timeline: Mid-July 2026
```

---

## 💡 Unique Differentiators

1. **Beautiful UI** — Better than Bloomberg Terminal
2. **Social Intelligence** — What are traders talking about?
3. **Supply Chain Transparency** — Track projects that affect prices
4. **Risk Intelligence** — Predict volatility before it happens
5. **Real-time Updates** — Prices update every second
6. **Affordable** — $4.99/month vs $24,000/year for Bloomberg

---

## 🎨 Design Inspiration Sources

Your images showed:
- **Finance app:** Clean card-based layouts, real-time updates
- **Crypto wallet:** Colorful alerts, price trends, portfolio view
- **IoT smart home:** Status indicators, control cards, real-time data

**Our design will blend:**
- Finance app's data clarity
- Crypto's visual excitement
- Smart home's real-time updates
- All in a commodity-specific context

---

## 📊 Competitive Advantage

| Feature | Bloomberg | TradingView | CommodityBubbles |
|---------|-----------|------------|------------------|
| Price data | ✅ | ✅ | ✅ Real-time |
| Charts | ✅ | ✅✅ | ✅ Interactive |
| News | ✅ | ⚠️ | ✅ Real-time |
| Social | ❌ | ⚠️ | ✅ Full feed |
| Projects | ❌ | ❌ | ✅ Tracking |
| Risk scores | ❌ | ⚠️ | ✅ Detailed |
| Mobile | ⚠️ | ✅ | ✅ Optimized |
| Price | $24k/year | $15/month | $5/month |

---

## 🎬 Next Immediate Actions

1. **Create visual mockups** (Today - 2 hours)
   - Homepage
   - Price ticker
   - Sentiment feed
   - Risk dashboard

2. **Update database schema** (Today - 1 hour)
   - Add new tables
   - Create migrations

3. **Start Week 1 Implementation** (Tomorrow)
   - Auth system (already have template)
   - Basic commodity cards
   - Mock data

4. **Design component library** (Week 1)
   - Price card
   - Sentiment widget
   - Project timeline
   - Risk indicator

---

## 🎯 Product Thesis

**Problem:** Commodity traders need to understand real-time supply disruptions and social sentiment but lack a unified, beautiful platform.

**Solution:** CommodityBubbles — a real-time intelligence dashboard showing prices, social sentiment, supply chain projects, and risk metrics in one beautiful interface.

**Market:** 
- 500K+ active commodity traders globally
- $2.5T commodity futures market
- Growing retail interest in inflation hedges

**Monetization:**
- B2C: Retail traders ($5-50/month)
- B2B: Trading firms (custom API)
- B2B2C: Partner with brokers

---

**This is a beautiful, real product. Let's build it.** 🚀
