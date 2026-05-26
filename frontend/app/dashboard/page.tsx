'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, AlertTriangle, MapPin, Calendar } from 'lucide-react';

// Types
interface Commodity {
  id: string;
  symbol: string;
  name: string;
  emoji: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  sentiment: 'bullish' | 'neutral' | 'bearish';
  volatility: number;
  supply: number;
}

interface SentimentPost {
  id: string;
  author: string;
  source: 'twitter' | 'reddit' | 'news';
  content: string;
  sentiment: number;
  engagement: number;
  isNew: boolean;
}

interface RiskScore {
  total: number;
  volatility: number;
  supply: number;
  status: 'low' | 'medium' | 'high' | 'critical';
}

// Main Component
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [sentiments, setSentiments] = useState<SentimentPost[]>([]);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Auth check & load data
  useEffect(() => {
    async function initializeDashboard() {
      try {
        // Load mock data (in real app, would check auth)
        setCommodities([
          {
            id: 'cu',
            symbol: 'Cu',
            name: 'Copper',
            emoji: '🟠',
            price: 4.65,
            change24h: 0.10,
            changePercent24h: 2.34,
            sentiment: 'bullish',
            volatility: 8.5,
            supply: 72,
          },
          {
            id: 'ni',
            symbol: 'Ni',
            name: 'Nickel',
            emoji: '🔴',
            price: 8.92,
            change24h: -0.11,
            changePercent24h: -1.22,
            sentiment: 'bearish',
            volatility: 12.1,
            supply: 45,
          },
          {
            id: 'zn',
            symbol: 'Zn',
            name: 'Zinc',
            emoji: '⚪',
            price: 2.67,
            change24h: 0.05,
            changePercent24h: 1.92,
            sentiment: 'neutral',
            volatility: 6.2,
            supply: 58,
          },
          {
            id: 'au',
            symbol: 'Au',
            name: 'Gold',
            emoji: '🟡',
            price: 2078.50,
            change24h: 39.22,
            changePercent24h: 1.89,
            sentiment: 'bullish',
            volatility: 3.1,
            supply: 82,
          },
        ]);

        setPortfolioValue(41812.14);

        setSentiments([
          {
            id: '1',
            author: 'CommodityTrader',
            source: 'twitter',
            content: 'Major copper shortage fears mounting as Peru mining strikes continue. Supply could be tight for Q3.',
            sentiment: 0.85,
            engagement: 1234,
            isNew: true,
          },
          {
            id: '2',
            author: 'InvestmentGuru',
            source: 'reddit',
            content: 'New nickel mine opening in Indonesia could push prices down 15% by Q4.',
            sentiment: -0.45,
            engagement: 567,
            isNew: false,
          },
        ]);

        setRiskScore({
          total: 72,
          volatility: 45,
          supply: 28,
          status: 'high',
        });

        setUser({ email: 'user@example.com' });
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    initializeDashboard();
  }, [router]);

  const handleLogout = async () => {
    try {
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20 lg:pb-0">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💎</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                CommodityBubbles
              </h1>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                ● Live & Updating
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Card */}
        <div className="bg-gradient-to-br from-blue-600/20 to-orange-600/20 border border-blue-500/30 rounded-xl p-6 mb-8 hover:border-blue-500/50 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm mb-1">Portfolio Value</p>
              <h2 className="text-4xl font-bold text-white mb-2">
                ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <p className="text-green-400 text-sm">
                +$10,859.48 (+35.5%) 📈
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm mb-2">Market Status</p>
              <p className="text-white font-semibold">Live & Updating</p>
              <p className="text-xs text-green-400">Last update: 2 seconds ago</p>
            </div>
          </div>
        </div>

        {/* Commodity Cards Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Live Prices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {commodities.map((commodity) => (
              <CommodityCard key={commodity.id} commodity={commodity} />
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left: Sentiment Feed */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">Market Sentiment</h3>
            <div className="space-y-3">
              {sentiments.map((post) => (
                <SentimentCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Right: Risk Dashboard */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Risk Score</h3>
            {riskScore && <RiskCard risk={riskScore} />}
          </div>
        </div>

        {/* Supply Chain Projects */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">📅 Supply Chain Updates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProjectCard
              name="Lusaka Copper Mine Expansion"
              location="Zambia"
              status="construction"
              daysUntilCompletion={128}
              impact="-5%"
              impactColor="green"
            />
            <ProjectCard
              name="New Delhi-Mumbai Railway"
              location="India"
              status="planning"
              daysUntilCompletion={220}
              impact="+8%"
              impactColor="red"
            />
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 lg:hidden">
        <div className="flex justify-around">
          {[
            { id: 'overview', label: '📊', name: 'Overview' },
            { id: 'prices', label: '💰', name: 'Prices' },
            { id: 'sentiment', label: '📢', name: 'Sentiment' },
            { id: 'alerts', label: '🔔', name: 'Alerts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-center transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-t-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
              title={tab.name}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// Commodity Card Component
function CommodityCard({ commodity }: { commodity: Commodity }) {
  const isPositive = commodity.change24h >= 0;
  const sentimentColors = {
    bullish: { bg: 'bg-green-500/20', text: 'text-green-400', label: '📈 Bullish' },
    neutral: { bg: 'bg-slate-500/20', text: 'text-slate-400', label: '➡️ Neutral' },
    bearish: { bg: 'bg-red-500/20', text: 'text-red-400', label: '📉 Bearish' },
  };

  const colors = sentimentColors[commodity.sentiment];

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all hover:shadow-lg hover:shadow-blue-500/10">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{commodity.emoji}</span>
          <div>
            <h4 className="text-white font-bold">{commodity.name}</h4>
            <p className="text-slate-400 text-xs">({commodity.symbol})</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            ${commodity.price.toFixed(2)}
          </div>
          <div
            className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}
          >
            {isPositive ? '▲' : '▼'} {Math.abs(commodity.changePercent24h).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-4 pb-4 border-b border-slate-700">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">24h Change</span>
          <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
            {isPositive ? '+' : ''}${commodity.change24h.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Volatility</span>
          <span className="text-white">{commodity.volatility.toFixed(1)}%</span>
        </div>
      </div>

      {/* Sentiment Badge */}
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
        {colors.label}
      </div>
    </div>
  );
}

// Sentiment Card Component
function SentimentCard({ post }: { post: SentimentPost }) {
  const sentimentLabel =
    post.sentiment > 0.5
      ? '🚀 BULLISH'
      : post.sentiment > 0
        ? '📈 Positive'
        : post.sentiment < -0.5
          ? '📉 BEARISH'
          : '❌ Negative';

  const sentimentColor =
    post.sentiment > 0 ? 'text-green-400' : post.sentiment < 0 ? 'text-red-400' : 'text-slate-400';

  const sourceIcon = post.source === 'twitter' ? '𝕏' : post.source === 'reddit' ? '📘' : '📰';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{sourceIcon}</span>
          <div>
            <p className="text-white text-sm font-medium">@{post.author}</p>
            <p className="text-slate-400 text-xs">
              {post.source === 'twitter' ? 'Twitter' : post.source === 'reddit' ? 'Reddit' : 'News'}
            </p>
          </div>
        </div>
        {post.isNew && (
          <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-1 rounded-full">
            🔥 NEW
          </span>
        )}
      </div>

      <p className="text-slate-300 text-sm mb-3 line-clamp-2">{post.content}</p>

      <div className={`inline-block px-2 py-1 rounded text-xs font-bold mb-3 ${sentimentColor}`}>
        {sentimentLabel}
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-400 border-t border-slate-700 pt-3">
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3" /> {post.engagement}
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" /> Share
        </div>
      </div>
    </div>
  );
}

// Risk Card Component
function RiskCard({ risk }: { risk: RiskScore }) {
  const statusColors = {
    low: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400', label: '🟢 Low' },
    medium: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      label: '🟡 Medium',
    },
    high: { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400', label: '🔴 High' },
    critical: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', label: '🔴🔴 Critical' },
  };

  const status = statusColors[risk.status];

  return (
    <div className={`${status.bg} border ${status.border} rounded-lg p-6`}>
      <div className="flex items-start gap-2 mb-4">
        <AlertTriangle className={`w-6 h-6 ${status.text}`} />
        <div>
          <p className="text-white font-bold">Supply Chain Risk</p>
          <p className={`text-sm ${status.text}`}>{status.label}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-5xl font-bold text-white mb-2">
          {risk.total}
          <span className="text-xl text-slate-400">/100</span>
        </p>

        {/* Risk bar */}
        <div className="bg-slate-700 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              risk.total >= 75
                ? 'bg-red-500'
                : risk.total >= 50
                  ? 'bg-orange-500'
                  : risk.total >= 25
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
            }`}
            style={{ width: `${risk.total}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/50 rounded p-3">
          <p className="text-xs text-slate-400 mb-1">Volatility</p>
          <p className="text-lg font-bold text-yellow-400">{risk.volatility}%</p>
        </div>
        <div className="bg-slate-900/50 rounded p-3">
          <p className="text-xs text-slate-400 mb-1">Supply Gap</p>
          <p className="text-lg font-bold text-orange-400">{risk.supply}%</p>
        </div>
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({
  name,
  location,
  status,
  daysUntilCompletion,
  impact,
  impactColor,
}: {
  name: string;
  location: string;
  status: string;
  daysUntilCompletion: number;
  impact: string;
  impactColor: 'green' | 'red';
}) {
  const statusColors = {
    planning: 'bg-blue-500/20 text-blue-400',
    construction: 'bg-yellow-500/20 text-yellow-400',
    operation: 'bg-green-500/20 text-green-400',
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all">
      <div className="mb-3">
        <h4 className="text-white font-bold text-sm mb-1">🏗️ {name}</h4>
        <p className={`text-xs font-bold px-2 py-1 rounded w-fit ${statusColors[status as keyof typeof statusColors]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-300 mb-3">
        <MapPin className="w-4 h-4 text-orange-400" />
        {location}
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
        <Calendar className="w-4 h-4 text-blue-400" />
        <span>{daysUntilCompletion} days until completion</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <span className="text-xs text-slate-400">Price Impact</span>
        <span className={`text-sm font-bold ${impactColor === 'green' ? 'text-green-400' : 'text-red-400'}`}>
          {impact}
        </span>
      </div>
    </div>
  );
}
