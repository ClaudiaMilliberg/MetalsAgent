# 🎨 Dashboard Integration Guide

**Objective:** Update your dashboard to use separate price/sentiment endpoints  
**Effort:** 5 minutes (copy-paste the hook)  
**Result:** Optimized quota usage + responsive UI

---

## 📋 What to Update

Your dashboard currently fetches everything at once. Now we'll split it into two endpoints:

```
OLD PATTERN (❌ Quota drain)
Dashboard polls every 30s
  ↓
GET /api/commodities/live
  ↓
Fetches prices + 3 sentiment calls
  ↓
8,640 NewsAPI calls/day

NEW PATTERN (✅ Quota safe)
Dashboard polls:
  • Prices: every 30 seconds
  • Sentiment: once per hour
    ↓
GET /api/commodities/live → prices only (0 API calls)
GET /api/commodities/sentiment → sentiment only (3 API calls, cached)
    ↓
72 NewsAPI calls/day
```

---

## 🔧 Implementation

### Step 1: Create the Custom Hook

Create this new file: `frontend/hooks/useCommodities.ts`

```typescript
'use client';

import { useEffect, useState } from 'react';

export interface CommodityData {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  change24h: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  volatility: number;
  emoji: string;
  lastUpdated: Date;
  source: string;
}

export interface InfrastructureProject {
  id: string;
  name: string;
  type: 'mining' | 'dam' | 'desalination' | 'irrigation' | 'reactor';
  location: string;
  country: string;
  status: 'planning' | 'construction' | 'operation';
  completionDate: Date;
  investmentBillion: number;
  impactOnPrice: number;
  commodityAffected: string[];
}

interface SentimentResponse {
  copper?: {
    sentiment: 'bullish' | 'bearish' | 'neutral';
    score: number;
    mentionCount: number;
    articles: Array<{
      title: string;
      source: string;
      url: string;
    }>;
  };
  uranium?: {
    sentiment: 'bullish' | 'bearish' | 'neutral';
    score: number;
    mentionCount: number;
    articles: Array<{
      title: string;
      source: string;
      url: string;
    }>;
  };
  water?: {
    sentiment: 'bullish' | 'bearish' | 'neutral';
    score: number;
    mentionCount: number;
    articles: Array<{
      title: string;
      source: string;
      url: string;
    }>;
  };
}

interface CommoditiesState {
  commodities: CommodityData[];
  projects: InfrastructureProject[];
  sentiment: SentimentResponse;
  loading: boolean;
  error: string | null;
  lastPriceUpdate: Date | null;
  lastSentimentUpdate: Date | null;
}

/**
 * Custom hook for fetching and merging commodity data
 *
 * Fetches prices frequently (30s) and sentiment infrequently (60min)
 * to optimize NewsAPI quota usage
 */
export function useCommodities() {
  const [state, setState] = useState<CommoditiesState>({
    commodities: [],
    projects: [],
    sentiment: {},
    loading: true,
    error: null,
    lastPriceUpdate: null,
    lastSentimentUpdate: null,
  });

  // ============= FETCH PRICES (Every 30 seconds) =============
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/commodities/live');
        const data = await res.json();

        if (data.success) {
          setState((prev) => ({
            ...prev,
            commodities: data.commodities,
            projects: data.projects,
            lastPriceUpdate: new Date(),
            error: null,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            error: data.message || 'Failed to fetch prices',
          }));
        }
      } catch (error) {
        console.error('Failed to fetch prices:', error);
        setState((prev) => ({
          ...prev,
          error: 'Failed to fetch commodity prices',
        }));
      }
    };

    // Fetch immediately
    fetchPrices();

    // Then fetch every 30 seconds
    const priceInterval = setInterval(fetchPrices, 30 * 1000);

    return () => clearInterval(priceInterval);
  }, []);

  // ============= FETCH SENTIMENT (Once per hour) =============
  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const res = await fetch('/api/commodities/sentiment');
        const data = await res.json();

        if (data.success) {
          setState((prev) => ({
            ...prev,
            sentiment: data.sentiment || {},
            lastSentimentUpdate: new Date(),
            loading: false,
          }));
        } else {
          console.warn('Failed to fetch sentiment:', data.message);
          setState((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch sentiment:', error);
        setState((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };

    // Fetch immediately
    fetchSentiment();

    // Then fetch every 60 minutes
    const sentimentInterval = setInterval(fetchSentiment, 60 * 60 * 1000);

    return () => clearInterval(sentimentInterval);
  }, []);

  // ============= MERGE PRICES + SENTIMENT =============
  const mergedCommodities = state.commodities.map((commodity) => ({
    ...commodity,
    sentiment:
      state.sentiment[commodity.id.toLowerCase()]?.sentiment || commodity.sentiment,
  }));

  return {
    commodities: mergedCommodities,
    projects: state.projects,
    sentiment: state.sentiment,
    loading: state.loading,
    error: state.error,
    lastPriceUpdate: state.lastPriceUpdate,
    lastSentimentUpdate: state.lastSentimentUpdate,
  };
}
```

### Step 2: Update Your Dashboard

Replace your current dashboard code with this optimized version:

```typescript
// app/dashboard/page.tsx

'use client';

import { useCommodities } from '@/hooks/useCommodities';
import { CommodityCard } from './components/CommodityCard';
import { SentimentFeed } from './components/SentimentFeed';
import { ProjectCard } from './components/ProjectCard';

export default function Dashboard() {
  const { commodities, projects, sentiment, loading, error, lastPriceUpdate, lastSentimentUpdate } =
    useCommodities();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💎 CommodityBubbles</h1>
          <p className="text-slate-400">
            Real-time commodity intelligence • Infrastructure tracking • Live sentiment
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
            ⚠️ {error}
          </div>
        )}

        {/* Update Status */}
        <div className="mb-6 flex gap-4 text-sm text-slate-400">
          <div>
            Prices: {lastPriceUpdate ? `${lastPriceUpdate.toLocaleTimeString()}` : 'Loading...'}
          </div>
          <div>•</div>
          <div>
            Sentiment:{' '}
            {lastSentimentUpdate ? `${lastSentimentUpdate.toLocaleTimeString()}` : 'Loading...'}
          </div>
        </div>

        {/* Commodity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {commodities.map((commodity) => (
            <CommodityCard
              key={commodity.id}
              commodity={commodity}
              sentimentData={sentiment[commodity.id.toLowerCase()]}
            />
          ))}
        </div>

        {/* Sentiment Feed + Risk Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SentimentFeed sentiment={sentiment} loading={loading} />
        </div>

        {/* Infrastructure Projects */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">🏗️ Infrastructure Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Footer with API Status */}
        <div className="text-center text-slate-500 text-xs pt-8 border-t border-slate-700">
          <p>
            Prices update every 30 seconds • Sentiment updates hourly • API quota: 72 calls/day
            (free tier: 100-500)
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Update CommodityCard Component

```typescript
// app/dashboard/components/CommodityCard.tsx

'use client';

import { CommodityData } from '@/hooks/useCommodities';

interface Props {
  commodity: CommodityData;
  sentimentData?: {
    sentiment: 'bullish' | 'bearish' | 'neutral';
    score: number;
    mentionCount: number;
    articles: Array<{
      title: string;
      source: string;
      url: string;
    }>;
  };
}

export function CommodityCard({ commodity, sentimentData }: Props) {
  const sentimentColor = {
    bullish: 'text-green-400',
    bearish: 'text-red-400',
    neutral: 'text-slate-400',
  }[commodity.sentiment];

  const sentimentBg = {
    bullish: 'bg-green-900/20 border-green-500/30',
    bearish: 'bg-red-900/20 border-red-500/30',
    neutral: 'bg-slate-700/30 border-slate-600/30',
  }[commodity.sentiment];

  const sentimentIcon = {
    bullish: '📈',
    bearish: '📉',
    neutral: '➡️',
  }[commodity.sentiment];

  return (
    <div
      className={`rounded-lg border backdrop-blur-sm p-6 transition-all hover:scale-105 ${sentimentBg}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-400 mb-1">{commodity.name}</p>
          <p className="text-3xl font-bold text-white">{commodity.emoji}</p>
        </div>
        <div className={`text-xl ${sentimentColor}`}>{sentimentIcon}</div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-white">
          ${commodity.currentPrice.toFixed(2)}
        </p>
        <p className={`text-sm ${commodity.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {commodity.change24h >= 0 ? '+' : ''}
          {commodity.change24h.toFixed(2)}%
        </p>
      </div>

      {/* Sentiment */}
      <div className="pt-4 border-t border-slate-600">
        <p className={`text-sm font-semibold ${sentimentColor} capitalize`}>
          {commodity.sentiment}
        </p>
        {sentimentData?.mentionCount && (
          <p className="text-xs text-slate-400 mt-1">
            {sentimentData.mentionCount} mentions in news
          </p>
        )}
      </div>

      {/* Articles Preview */}
      {sentimentData?.articles && sentimentData.articles.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-600">
          <a
            href={sentimentData.articles[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 line-clamp-2"
          >
            📰 {sentimentData.articles[0].title}
          </a>
        </div>
      )}
    </div>
  );
}
```

---

## ✅ Verification Checklist

Before deploying:

- [ ] Created `/hooks/useCommodities.ts`
- [ ] Updated dashboard to import and use `useCommodities()`
- [ ] Updated all components that reference commodity data
- [ ] Tested locally: `npm run dev`
- [ ] Verified prices update every 30 seconds
- [ ] Verified sentiment updates once per hour (check console for timing)
- [ ] No console errors
- [ ] API endpoints respond correctly

---

## 🚀 Deploy

```bash
cd ~/Desktop/Metals\ Agent\ Appv1/

# Stage new hook
git add frontend/hooks/useCommodities.ts

# Stage updated dashboard
git add frontend/app/dashboard/page.tsx
git add frontend/app/dashboard/components/CommodityCard.tsx

# Stage documentation
git add API_USAGE_GUIDE.md
git add DASHBOARD_INTEGRATION.md

# Commit
git commit -m "📊 Integrate dual-endpoint architecture for quota optimization

- New hook: useCommodities() fetches prices/sentiment separately
- Prices: 30-second polling (unlimited)
- Sentiment: 60-minute polling (3 calls, cached)
- Result: 72 calls/day vs 8,640 (100x reduction)
- Dashboard shows update timestamps for transparency"

# Push
git push origin main
```

---

## 📱 What Users See

### Before Update
- Dashboard responsive but burns through quota
- Real-time sentiment but API calls accumulate rapidly

### After Update
- Dashboard still responsive (prices every 30s)
- Sentiment updates every hour (acceptable delay for news)
- Quota usage visible in footer
- Zero API errors due to quota limits

---

## 🎯 Performance Impact

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| Price latency | 30s | 30s | ✅ Same |
| Sentiment latency | Real-time | 1 hour | ⚠️ Acceptable |
| API quota usage | 8,640/day | 72/day | 🚀 100x improvement |
| Free tier compliance | ❌ Over quota | ✅ Safe | ✅ Infinite scaling |

---

**Status: 🟢 READY TO DEPLOY**

Copy-paste the code, commit, push, and your app is quota-optimized forever.
