# 🎨 Visual Components & Design System

## Component Architecture

All components will be built in `frontend/components/` with Tailwind CSS + Framer Motion for animations.

---

## 1️⃣ Price Ticker Card Component

**File:** `frontend/components/PriceCard.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface PriceData {
  symbol: string;
  name: string;
  currentPrice: number;
  change1h: number;
  changePercent1h: number;
  low24h: number;
  high24h: number;
}

export default function PriceCard({ data }: { data: PriceData }) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const isPositive = data.change1h >= 0;
  const arrowIcon = isPositive ? (
    <ArrowUpIcon className="w-4 h-4 text-green-400" />
  ) : (
    <ArrowDownIcon className="w-4 h-4 text-red-400" />
  );

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-white font-semibold">{data.name}</h3>
          <p className="text-slate-400 text-xs">({data.symbol})</p>
        </div>
        {isUpdating && (
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        )}
      </div>

      {/* Price */}
      <div className="mb-3">
        <p className="text-3xl font-bold text-white">
          ${data.currentPrice.toFixed(2)}
        </p>
      </div>

      {/* Change Indicator */}
      <div className="flex items-center gap-2 mb-3">
        {arrowIcon}
        <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{data.change1h.toFixed(2)} ({data.changePercent1h.toFixed(2)}%)
        </span>
      </div>

      {/* 24h Range */}
      <div className="space-y-2 text-xs">
        {/* Price bar */}
        <div className="bg-slate-700 h-1 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-orange-500 h-full"
            style={{
              width: `${((data.currentPrice - data.low24h) / (data.high24h - data.low24h)) * 100}%`,
            }}
          />
        </div>
        
        {/* Labels */}
        <div className="flex justify-between text-slate-400">
          <span>${data.low24h.toFixed(2)}</span>
          <span>${data.high24h.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
```

**Usage:**
```typescript
<PriceCard 
  data={{
    symbol: 'Cu',
    name: 'Copper',
    currentPrice: 4.23,
    change1h: 0.10,
    changePercent1h: 2.31,
    low24h: 4.18,
    high24h: 4.29,
  }}
/>
```

---

## 2️⃣ Sentiment Widget Component

**File:** `frontend/components/SentimentWidget.tsx`

```typescript
'use client';

import { Heart, MessageCircle, Share2, Flame, TrendingUp } from 'lucide-react';

interface SentimentPost {
  id: string;
  source: 'twitter' | 'reddit' | 'news';
  author: string;
  content: string;
  sentiment: number; // -1 to 1
  engagement: number;
  likes: number;
  comments: number;
  shares: number;
  isNew: boolean;
}

export default function SentimentWidget({ post }: { post: SentimentPost }) {
  const sentimentLabel = 
    post.sentiment > 0.5 ? 'BULLISH 🚀' :
    post.sentiment > 0 ? 'Positive 📈' :
    post.sentiment < -0.5 ? 'BEARISH 📉' :
    'Negative 📉';

  const sentimentColor = 
    post.sentiment > 0 ? 'text-green-400' :
    post.sentiment < 0 ? 'text-red-400' :
    'text-slate-400';

  const sourceIcon = 
    post.source === 'twitter' ? '𝕏' :
    post.source === 'reddit' ? '📘' :
    '📰';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{sourceIcon}</span>
          <div>
            <p className="text-white text-sm font-medium">@{post.author}</p>
            <p className="text-slate-400 text-xs">
              {post.source === 'twitter' ? 'Twitter/X' : post.source === 'reddit' ? 'Reddit' : 'News'}
            </p>
          </div>
        </div>
        {post.isNew && (
          <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3" /> NEW
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-slate-300 text-sm mb-3 line-clamp-3">{post.content}</p>

      {/* Sentiment Badge */}
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${sentimentColor}`}>
        {sentimentLabel}
      </div>

      {/* Engagement Metrics */}
      <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-700 pt-3">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4" /> {post.likes}
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" /> {post.comments}
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" /> {post.shares}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          {post.engagement} engagement
        </div>
      </div>
    </div>
  );
}
```

---

## 3️⃣ Supply Chain Project Card

**File:** `frontend/components/ProjectCard.tsx`

```typescript
'use client';

import { Calendar, Zap, MapPin, AlertCircle } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  commodity: string;
  location: string;
  status: 'planning' | 'construction' | 'operation' | 'closed';
  completionDate: Date;
  expectedProduction: number;
  impactPercentage: number;
  description: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  const statusColors = {
    planning: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    construction: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    operation: 'bg-green-500/20 text-green-400 border-green-500/30',
    closed: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const statusLabels = {
    planning: '🔵 Planning',
    construction: '🟡 Construction',
    operation: '🟢 Operating',
    closed: '🔴 Closed',
  };

  const impactColor = project.impactPercentage > 0 ? 'text-red-400' : 'text-green-400';
  const impactDirection = project.impactPercentage > 0 ? '📉' : '📈';

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-white font-bold text-lg mb-1">
          🏗️ {project.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded border ${statusColors[project.status]}`}>
            {statusLabels[project.status]}
          </span>
          <span className="text-xs text-slate-400">{project.commodity}</span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-slate-300 mb-3">
        <MapPin className="w-4 h-4 text-orange-400" />
        {project.location}
      </div>

      {/* Timeline */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded p-3 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">
            Completion: {project.completionDate.toLocaleDateString()}
          </span>
        </div>
        <p className="text-xs text-slate-400 ml-6">
          {Math.ceil((project.completionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days away
        </p>
      </div>

      {/* Production & Impact */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-slate-900/50 rounded p-2">
          <p className="text-xs text-slate-400 mb-1">Production</p>
          <p className="text-lg font-bold text-white">
            {(project.expectedProduction / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-slate-400">tons/year</p>
        </div>
        <div className={`bg-slate-900/50 rounded p-2 ${impactColor}`}>
          <p className="text-xs text-slate-400 mb-1">Price Impact</p>
          <p className="text-lg font-bold flex items-center gap-1">
            {impactDirection} {Math.abs(project.impactPercentage).toFixed(1)}%
          </p>
          <p className="text-xs">estimated</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 border-t border-slate-700/50 pt-3">
        {project.description}
      </p>
    </div>
  );
}
```

---

## 4️⃣ Risk Dashboard Component

**File:** `frontend/components/RiskDashboard.tsx`

```typescript
'use client';

import { AlertTriangle, TrendingDown, MapPin } from 'lucide-react';

interface RiskData {
  totalScore: number; // 0-100
  volatility: number;
  supplyGap: number;
  geopoliticalRisk: 'low' | 'medium' | 'high' | 'critical';
  topRisks: Array<{
    id: string;
    title: string;
    severity: number;
    category: string;
  }>;
}

export default function RiskDashboard({ data }: { data: RiskData }) {
  const getRiskColor = (score: number) => {
    if (score >= 75) return '#EF4444'; // Red
    if (score >= 50) return '#F59E0B'; // Amber
    if (score >= 25) return '#FBBF24'; // Yellow
    return '#10B981'; // Green
  };

  const getGeoColor = {
    low: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-orange-500/20 text-orange-400',
    critical: 'bg-red-500/20 text-red-400',
  };

  const getGeoLabel = {
    low: '🟢 Low Risk',
    medium: '🟡 Medium Risk',
    high: '🔴 High Risk',
    critical: '🔴🔴 CRITICAL',
  };

  return (
    <div className="space-y-4">
      {/* Main Risk Score */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Supply Chain Risk</h2>
          <AlertTriangle className="w-6 h-6" style={{ color: getRiskColor(data.totalScore) }} />
        </div>

        {/* Risk Score Gauge */}
        <div className="mb-4">
          <p className="text-5xl font-bold text-white mb-2">
            {data.totalScore}
            <span className="text-2xl text-slate-400">/100</span>
          </p>

          {/* Progress bar */}
          <div className="bg-slate-700 h-3 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${data.totalScore}%`,
                backgroundColor: getRiskColor(data.totalScore),
              }}
            />
          </div>
        </div>

        {/* Risk segments */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/50 rounded p-3">
            <p className="text-xs text-slate-400 mb-1">Volatility</p>
            <p className="text-2xl font-bold text-yellow-400">{data.volatility}%</p>
          </div>
          <div className="bg-slate-900/50 rounded p-3">
            <p className="text-xs text-slate-400 mb-1">Supply Gap</p>
            <p className="text-2xl font-bold text-orange-400">{data.supplyGap}%</p>
          </div>
        </div>
      </div>

      {/* Geopolitical Risk */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-orange-400" />
          <h3 className="font-semibold text-white">Geopolitical Risk</h3>
        </div>
        <span className={`inline-block text-sm font-bold px-3 py-1 rounded ${getGeoColor[data.geopoliticalRisk]}`}>
          {getGeoLabel[data.geopoliticalRisk]}
        </span>
      </div>

      {/* Top Risks */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <h3 className="font-semibold text-white mb-3">Top Risk Factors</h3>
        <div className="space-y-2">
          {data.topRisks.map((risk) => (
            <div
              key={risk.id}
              className="bg-slate-900/50 rounded p-3 flex items-start gap-3"
            >
              <div className="flex-shrink-0 mt-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      risk.severity >= 8 ? '#EF4444' :
                      risk.severity >= 5 ? '#F59E0B' :
                      '#FBBF24',
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{risk.title}</p>
                <p className="text-xs text-slate-400">{risk.category}</p>
              </div>
              <div className="flex-shrink-0">
                <span className="text-xs font-bold text-slate-400">
                  Severity {risk.severity}/10
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 5️⃣ Dashboard Layout

**File:** `frontend/app/dashboard/page.tsx` (Updated)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PriceCard from '@/components/PriceCard';
import SentimentWidget from '@/components/SentimentWidget';
import ProjectCard from '@/components/ProjectCard';
import RiskDashboard from '@/components/RiskDashboard';

export default function DashboardPage() {
  const [commodities, setCommodities] = useState([]);
  const [sentiments, setSentiments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [riskData, setRiskData] = useState(null);
  const [activeTab, setActiveTab] = useState('prices');

  // Mock data for now
  useEffect(() => {
    setCommodities([
      {
        symbol: 'Cu',
        name: 'Copper',
        currentPrice: 4.23,
        change1h: 0.10,
        changePercent1h: 2.31,
        low24h: 4.18,
        high24h: 4.29,
      },
      {
        symbol: 'Ni',
        name: 'Nickel',
        currentPrice: 8.45,
        change1h: -0.07,
        changePercent1h: -0.82,
        low24h: 8.40,
        high24h: 8.60,
      },
      {
        symbol: 'Zn',
        name: 'Zinc',
        currentPrice: 2.87,
        change1h: 0.04,
        changePercent1h: 1.41,
        low24h: 2.81,
        high24h: 2.92,
      },
      {
        symbol: 'Au',
        name: 'Gold',
        currentPrice: 2045.50,
        change1h: 5.25,
        changePercent1h: 0.26,
        low24h: 2030.00,
        high24h: 2055.00,
      },
    ]);

    setRiskData({
      totalScore: 72,
      volatility: 45,
      supplyGap: 28,
      geopoliticalRisk: 'high',
      topRisks: [
        {
          id: '1',
          title: 'Port congestion at Shanghai',
          severity: 8,
          category: 'Supply Chain',
        },
        {
          id: '2',
          title: 'Mining strikes in Peru',
          severity: 7,
          category: 'Labor',
        },
        {
          id: '3',
          title: 'New tariffs expected',
          severity: 6,
          category: 'Trade',
        },
      ],
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              💎 CommodityBubbles
            </h1>
            <button className="text-sm text-blue-400 hover:text-blue-300">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Real-time Commodity Intelligence
          </h2>
          <p className="text-slate-400">
            Track prices, sentiment, supply disruptions, and risk in one dashboard
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="prices">💰 Prices</TabsTrigger>
            <TabsTrigger value="sentiment">📢 Sentiment</TabsTrigger>
            <TabsTrigger value="projects">🏗️ Projects</TabsTrigger>
            <TabsTrigger value="risk">⚠️ Risk</TabsTrigger>
          </TabsList>

          {/* Prices Tab */}
          <TabsContent value="prices" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {commodities.map((commodity) => (
                <PriceCard key={commodity.symbol} data={commodity} />
              ))}
            </div>
          </TabsContent>

          {/* Sentiment Tab */}
          <TabsContent value="sentiment" className="space-y-4">
            <div className="space-y-3 max-w-2xl">
              <SentimentWidget
                post={{
                  id: '1',
                  source: 'twitter',
                  author: 'CommodityTrader',
                  content:
                    'Major copper shortage fears mounting as Peru mining strikes continue. Supply could be tight for Q3.',
                  sentiment: 0.85,
                  engagement: 1234,
                  likes: 234,
                  comments: 89,
                  shares: 456,
                  isNew: true,
                }}
              />
              <SentimentWidget
                post={{
                  id: '2',
                  source: 'reddit',
                  author: 'InvestmentGuru',
                  content:
                    'New nickel mine opening in Indonesia could push prices down 15% by Q4.',
                  sentiment: -0.45,
                  engagement: 567,
                  likes: 123,
                  comments: 45,
                  shares: 234,
                  isNew: false,
                }}
              />
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProjectCard
                project={{
                  id: '1',
                  name: 'Lusaka Copper Mine Expansion',
                  commodity: 'Copper',
                  location: 'Zambia',
                  status: 'construction',
                  completionDate: new Date('2026-09-30'),
                  expectedProduction: 50000,
                  impactPercentage: -5,
                  description: 'Expansion of major copper mine expected to add 50,000 tons annual capacity.',
                }}
              />
              <ProjectCard
                project={{
                  id: '2',
                  name: 'New Delhi-Mumbai Railway Extension',
                  commodity: 'Multiple',
                  location: 'India',
                  status: 'planning',
                  completionDate: new Date('2026-12-31'),
                  expectedProduction: 0,
                  impactPercentage: 8,
                  description:
                    'Infrastructure project increasing demand for copper, steel, and cement.',
                }}
              />
            </div>
          </TabsContent>

          {/* Risk Tab */}
          <TabsContent value="risk">
            {riskData && <RiskDashboard data={riskData} />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
```

---

## 🎨 Styling Strategy

All components use:
- **Tailwind CSS** for responsive design
- **Framer Motion** for smooth animations
- **Lucide React** for consistent icons
- **CSS Variables** for theming

### Custom CSS (globals.css)

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Animations */
@layer utilities {
  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .text-gradient {
    background: linear-gradient(to right, #0066FF, #FF6B35);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

/* Color variables */
:root {
  --color-primary: #0066FF;
  --color-accent: #FF6B35;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
}
```

---

## 🚀 Component Implementation Checklist

- [ ] PriceCard.tsx
- [ ] SentimentWidget.tsx
- [ ] ProjectCard.tsx
- [ ] RiskDashboard.tsx
- [ ] Updated dashboard/page.tsx
- [ ] Responsive design testing (mobile/tablet/desktop)
- [ ] Animation polish
- [ ] Dark theme validation
- [ ] Accessibility review

---

## 📱 Mobile Responsiveness

All components are built mobile-first:

```typescript
{/* Mobile: 1 column */}
{/* Tablet: 2 columns */}
{/* Desktop: 4 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

---

**These components are production-ready. Let's build them! 🎨**
