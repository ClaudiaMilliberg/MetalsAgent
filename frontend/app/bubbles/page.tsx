'use client';

import { useState, useEffect } from 'react';
import BubbleVisualization from './components/BubbleVisualization';
import BubbleDetailCard from './components/BubbleDetailCard';

interface Commodity {
  id: string;
  name: string;
  price: number;
  change24h: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  volatility: number;
  glow: 'orange' | 'blue' | 'white' | 'purple';
  signalBreakdown: {
    reddit: number;
    news: number;
    twitter: number;
    onchain: number;
  };
  headlines: string[];
  demand: string;
  confidence: number;
  lastUpdated: string;
}

export default function BubblesPage() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleSources, setVisibleSources] = useState({
    reddit: true,
    news: true,
    twitter: true,
    onchain: true,
  });
  const [sortBy, setSortBy] = useState<'volatility' | 'sentiment' | 'change'>('sentiment');
  const [searchTerm, setSearchTerm] = useState('');
  const [secondsAgo, setSecondsAgo] = useState(0);

  // Fallback mock data for sentiment
  const mockSentimentData: Commodity[] = [
    {
      id: 'copper',
      name: 'Copper',
      price: 4.85,
      change24h: 2.34,
      sentiment: 'bullish',
      score: 78,
      volatility: 12.5,
      glow: 'orange',
      signalBreakdown: { reddit: 85, news: 72, twitter: 65, onchain: 80 },
      headlines: ['Copper rallies on supply concerns', 'Construction demand rebounds'],
      demand: 'High',
      confidence: 0.92,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'gold',
      name: 'Gold',
      price: 2449.75,
      change24h: 1.89,
      sentiment: 'bullish',
      score: 85,
      volatility: 8.3,
      glow: 'white',
      signalBreakdown: { reddit: 78, news: 88, twitter: 82, onchain: 75 },
      headlines: ['Gold strengthens as yields fall', 'Central banks buy more gold'],
      demand: 'Very High',
      confidence: 0.95,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'nickel',
      name: 'Nickel',
      price: 9.42,
      change24h: -1.22,
      sentiment: 'bearish',
      score: 35,
      volatility: 15.2,
      glow: 'blue',
      signalBreakdown: { reddit: 32, news: 38, twitter: 40, onchain: 28 },
      headlines: ['Nickel oversupply continues', 'Indonesian production rises'],
      demand: 'Moderate',
      confidence: 0.88,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'zinc',
      name: 'Zinc',
      price: 1.28,
      change24h: 0.89,
      sentiment: 'neutral',
      score: 55,
      volatility: 9.7,
      glow: 'purple',
      signalBreakdown: { reddit: 55, news: 52, twitter: 58, onchain: 60 },
      headlines: ['Zinc inventory stabilizes', 'Industrial production mixed'],
      demand: 'Moderate',
      confidence: 0.82,
      lastUpdated: new Date().toISOString(),
    },
  ];

  // Fetch sentiment data
  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const res = await fetch('/api/bubbles/sentiment');
        const data = await res.json();
        setCommodities(data.commodities || mockSentimentData);
        setLoading(false);
      } catch (error) {
        console.warn('Using fallback sentiment data:', error);
        setCommodities(mockSentimentData);
        setLoading(false);
      }
    };

    fetchSentiment();
    const interval = setInterval(fetchSentiment, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Update time ticker
  useEffect(() => {
    const interval = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredCommodities = commodities
    .filter((c) => {
      // Map glow color to source
      const sourceMap: Record<string, keyof typeof visibleSources> = {
        orange: 'reddit',
        white: 'news',
        blue: 'twitter',
        purple: 'onchain',
      };
      const source = sourceMap[c.glow as keyof typeof sourceMap] || 'news';
      if (!visibleSources[source]) return false;
      if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'volatility') return b.volatility - a.volatility;
      if (sortBy === 'sentiment') return b.score - a.score;
      if (sortBy === 'change') return b.change24h - a.change24h;
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading sentiment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030810] via-[#0a0e1f] to-[#0f0820] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">🫧 Sentiment Bubbles</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Multi-source sentiment analysis from Reddit, News, X, and On-chain data
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="col-span-1 md:col-span-2 px-4 py-3 rounded-lg glass-premium text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition"
          />

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 rounded-lg glass-premium text-white focus:outline-none focus:border-blue-400 transition"
          >
            <option value="sentiment">Sort: Sentiment</option>
            <option value="volatility">Sort: Volatility</option>
            <option value="change">Sort: 24h Change</option>
          </select>

          {/* Sources */}
          <div className="flex gap-2">
            <button
              onClick={() => setVisibleSources((v) => ({ ...v, reddit: !v.reddit }))}
              className={`px-3 py-2 rounded text-sm font-semibold transition ${
                visibleSources.reddit
                  ? 'bg-orange-600/50 text-orange-200 border border-orange-500/50'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
              title="Reddit signals"
            >
              🔴
            </button>
            <button
              onClick={() => setVisibleSources((v) => ({ ...v, news: !v.news }))}
              className={`px-3 py-2 rounded text-sm font-semibold transition ${
                visibleSources.news
                  ? 'bg-white/20 text-white border border-white/50'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
              title="News signals"
            >
              📰
            </button>
            <button
              onClick={() => setVisibleSources((v) => ({ ...v, twitter: !v.twitter }))}
              className={`px-3 py-2 rounded text-sm font-semibold transition ${
                visibleSources.twitter
                  ? 'bg-blue-600/50 text-blue-200 border border-blue-500/50'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
              title="X/Twitter signals"
            >
              𝕏
            </button>
            <button
              onClick={() => setVisibleSources((v) => ({ ...v, onchain: !v.onchain }))}
              className={`px-3 py-2 rounded text-sm font-semibold transition ${
                visibleSources.onchain
                  ? 'bg-purple-600/50 text-purple-200 border border-purple-500/50'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
              title="On-chain signals"
            >
              ⛓️
            </button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mb-6 text-sm text-slate-400">
          Last updated {secondsAgo}s ago
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Bubble Visualization */}
          <div className="lg:col-span-2">
            <div className="glass-premium-strong rounded-2xl p-6 h-96">
              <BubbleVisualization
                commodities={filteredCommodities}
                selectedCommodity={selectedCommodity}
                onSelect={setSelectedCommodity}
              />
            </div>
          </div>

          {/* Detail Card */}
          <div>
            {selectedCommodity ? (
              <BubbleDetailCard commodity={selectedCommodity} />
            ) : (
              <div className="glass-premium-strong rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl mb-3">👆</p>
                  <p className="text-gray-400 font-semibold">Click a bubble for details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-premium rounded-xl p-4">
            <p className="font-bold text-white mb-2">Signal Sources</p>
            <p className="text-xs text-gray-400 mb-1">🔴 Reddit</p>
            <p className="text-xs text-gray-400 mb-1">📰 News</p>
            <p className="text-xs text-gray-400 mb-1">𝕏 Twitter</p>
            <p className="text-xs text-gray-400">⛓️ On-chain</p>
          </div>
          <div className="glass-premium rounded-xl p-4">
            <p className="font-bold text-white mb-2">Sentiment</p>
            <p className="text-xs text-green-400 mb-1">🟢 Bullish</p>
            <p className="text-xs text-red-400 mb-1">🔴 Bearish</p>
            <p className="text-xs text-amber-400">🟡 Neutral</p>
          </div>
          <div className="glass-premium rounded-xl p-4">
            <p className="font-bold text-white mb-2">Size = Volatility</p>
            <p className="text-xs text-gray-400">Larger bubbles indicate higher volatility</p>
          </div>
          <div className="glass-premium rounded-xl p-4">
            <p className="font-bold text-white mb-2">Glow = Signal Source</p>
            <p className="text-xs text-gray-400">Glow color shows dominant signal source</p>
          </div>
        </div>
      </div>
    </div>
  );
}
