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

  // Fetch sentiment data
  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const res = await fetch('/api/bubbles/sentiment');
        const data = await res.json();
        setCommodities(data.commodities || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch sentiment:', error);
        setLoading(false);
      }
    };

    fetchSentiment();
    const interval = setInterval(fetchSentiment, 30 * 1000); // Refresh every 30 seconds
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🫧 Commodity Sentiment Bubbles</h1>
          <p className="text-slate-400">
            Real-time sentiment visualization from Reddit, News, X, and On-chain sources
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search commodity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="col-span-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bubble Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 h-96">
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
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 h-96 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-slate-400 mb-2">👆</p>
                  <p className="text-slate-400">Click a bubble to see details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-slate-800/30 rounded p-3 border border-slate-700/50">
            <p className="font-semibold text-slate-300 mb-1">Signal Sources</p>
            <p className="text-slate-400">🔴 Reddit</p>
            <p className="text-slate-400">📰 News</p>
            <p className="text-slate-400">𝕏 Twitter</p>
            <p className="text-slate-400">⛓️ On-chain</p>
          </div>
          <div className="bg-slate-800/30 rounded p-3 border border-slate-700/50">
            <p className="font-semibold text-slate-300 mb-1">Sentiment</p>
            <p className="text-emerald-400">🟢 Bullish</p>
            <p className="text-red-400">🔴 Bearish</p>
            <p className="text-amber-400">🟡 Neutral</p>
          </div>
          <div className="bg-slate-800/30 rounded p-3 border border-slate-700/50">
            <p className="font-semibold text-slate-300 mb-1">Size = Volatility</p>
            <p className="text-slate-400">Larger bubbles = more volatile</p>
          </div>
          <div className="bg-slate-800/30 rounded p-3 border border-slate-700/50">
            <p className="font-semibold text-slate-300 mb-1">Glow = Dominant Source</p>
            <p className="text-slate-400">Glow color shows which signal is strongest</p>
          </div>
        </div>
      </div>
    </div>
  );
}
