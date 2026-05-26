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
    <div className="min-h-screen bg-gradient-to-br from-[#030810] via-[#0a0e1f] to-[#0f0820] p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">🫧 Sentiment Bubbles</h1>
            <button
              onClick={() => {
                setLoading(true);
                fetch('/api/bubbles/sentiment')
                  .then((res) => res.json())
                  .then((data) => {
                    setCommodities(data.commodities);
                    setLoading(false);
                  })
                  .catch(() => {
                    setLoading(false);
                  });
              }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-premium text-white hover:glass-premium-strong transition-all duration-300 font-semibold text-sm"
              title="Manually refresh sentiment data"
            >
              ⟲ Refresh
            </button>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Multi-source sentiment analysis from Reddit, News, X, and On-chain data • Auto-updates every 30s
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          {/* Search and Sort Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search commodities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:col-span-2 px-4 py-3 rounded-lg glass-premium text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500/50 transition"
            />

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 rounded-lg glass-premium text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500/50 transition cursor-pointer"
            >
              <option value="sentiment">Sentiment ↓</option>
              <option value="volatility">Volatility ↓</option>
              <option value="change">24h Change ↓</option>
            </select>
          </div>

          {/* Source Filter Row */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            <span className="text-xs text-gray-400 uppercase tracking-wider self-center font-semibold">Signals:</span>
            <button
              onClick={() => setVisibleSources((v) => ({ ...v, reddit: !v.reddit }))}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition duration-300 ease-premium border touch-target ${
                visibleSources.reddit
                  ? 'bg-orange-600/50 text-orange-200 border-orange-500/50 shadow-lg shadow-orange-500/20'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-700/50'
              }`}
              title="Toggle Reddit signals"
            >
              🔴 Reddit
            </button>
            <button
              onClick={() => setVisibleSources((v) => ({ ...v, news: !v.news }))}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition duration-300 ease-premium border touch-target ${
                visibleSources.news
                  ? 'bg-white/20 text-white border-white/50 shadow-lg shadow-white/20'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-700/50'
              }`}
              title="Toggle News signals"
            >
              📰 News
            </button>
            <button
              onClick={() => setVisibleSources((v) => ({ ...v, twitter: !v.twitter }))}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition duration-300 ease-premium border touch-target ${
                visibleSources.twitter
                  ? 'bg-blue-600/50 text-blue-200 border-blue-500/50 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-700/50'
              }`}
              title="Toggle X/Twitter signals"
            >
              𝕏 Twitter
            </button>
            <button
              onClick={() => setVisibleSources((v) => ({ ...v, onchain: !v.onchain }))}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition duration-300 ease-premium border touch-target ${
                visibleSources.onchain
                  ? 'bg-purple-600/50 text-purple-200 border-purple-500/50 shadow-lg shadow-purple-500/20'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-700/50'
              }`}
              title="Toggle On-chain signals"
            >
              ⛓️ On-chain
            </button>
          </div>
        </div>

        {/* Last Updated & Data Stats */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>Last updated <span className="text-emerald-400 font-semibold">{secondsAgo}s</span> ago</span>
          </div>
          <div className="text-slate-500">
            Showing {filteredCommodities.length} of {commodities.length} commodities
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Bubble Visualization */}
          <div className="lg:col-span-2 order-1 lg:order-1">
            <div className="glass-premium-strong rounded-2xl p-4 sm:p-6 h-80 sm:h-96 shadow-2xl hover:shadow-2xl transition-shadow duration-300">
              <BubbleVisualization
                commodities={filteredCommodities}
                selectedCommodity={selectedCommodity}
                onSelect={setSelectedCommodity}
              />
            </div>
            <div className="mt-4 text-center text-xs text-gray-400 hidden sm:block">
              💡 Tip: Click bubbles to see detailed sentiment analysis
            </div>
          </div>

          {/* Detail Card */}
          <div className="order-2 lg:order-2">
            {selectedCommodity ? (
              <BubbleDetailCard commodity={selectedCommodity} />
            ) : (
              <div className="glass-premium-strong rounded-2xl p-6 sm:p-8 min-h-96 sm:h-96 flex flex-col items-center justify-center shadow-2xl">
                <div className="text-center">
                  <p className="text-5xl sm:text-6xl mb-4">👆</p>
                  <p className="text-gray-300 font-semibold text-lg mb-2">Select a bubble</p>
                  <p className="text-gray-400 text-sm">Click any commodity bubble to view detailed sentiment analysis, signal breakdown, and market headlines</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Quick Reference</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-premium rounded-xl p-5 sm:p-6 hover:glass-premium-strong transition-all duration-300">
              <p className="font-bold text-white mb-3 text-sm">Signal Sources</p>
              <div className="space-y-1.5">
                <p className="text-xs text-orange-400 font-medium">🔴 Reddit</p>
                <p className="text-xs text-gray-300 font-medium">📰 News</p>
                <p className="text-xs text-blue-400 font-medium">𝕏 Twitter</p>
                <p className="text-xs text-purple-400 font-medium">⛓️ On-chain</p>
              </div>
            </div>
            <div className="glass-premium rounded-xl p-5 sm:p-6 hover:glass-premium-strong transition-all duration-300">
              <p className="font-bold text-white mb-3 text-sm">Sentiment</p>
              <div className="space-y-1.5">
                <p className="text-xs text-green-400 font-medium">🟢 Bullish</p>
                <p className="text-xs text-red-400 font-medium">🔴 Bearish</p>
                <p className="text-xs text-amber-400 font-medium">🟡 Neutral</p>
              </div>
            </div>
            <div className="glass-premium rounded-xl p-5 sm:p-6 hover:glass-premium-strong transition-all duration-300">
              <p className="font-bold text-white mb-3 text-sm">Bubble Size</p>
              <p className="text-xs text-gray-300 leading-relaxed">Larger bubbles = higher volatility. Smaller bubbles = lower volatility.</p>
            </div>
            <div className="glass-premium rounded-xl p-5 sm:p-6 hover:glass-premium-strong transition-all duration-300">
              <p className="font-bold text-white mb-3 text-sm">Glow Color</p>
              <p className="text-xs text-gray-300 leading-relaxed">Glow indicates the dominant signal source driving the sentiment score.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
