'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BubbleMap from '@/components/BubbleMap';
import PriceCard from '@/components/PriceCard';
import NewsFeed from '@/components/NewsFeed';
import { mockCommodities, mockNews, mockPriceHistory, mockPortfolioValue } from '@/lib/mockData';

interface Commodity {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  change24h: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  volatility: number;
  emoji: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [commodities, setCommodities] = useState<Commodity[]>(mockCommodities);
  const [portfolioValue, setPortfolioValue] = useState(mockPortfolioValue);

  useEffect(() => {
    // Simulate checking auth and loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1135] to-[#1a0f2e] relative overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Cinematic spinner */}
          <div className="relative w-20 h-20">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-spin" style={{ animationDuration: '3s' }}></div>

            {/* Middle ring */}
            <div className="absolute inset-2 rounded-full border border-blue-400/40 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>

            {/* Inner dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-500/50"></div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full shadow-lg shadow-blue-500/30 blur-xl"></div>
          </div>

          <p className="text-sm text-gray-400 font-semibold uppercase tracking-widest">Loading Markets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1135] to-[#1a0f2e] text-white relative overflow-hidden">
      {/* Atmospheric background lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-right blue light */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        {/* Bottom-left purple light */}
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Hero Section with Bubble Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bubble Map - Takes 2/3 on desktop */}
          <div className="lg:col-span-2 h-96 lg:h-[500px]">
            <BubbleMap commodities={commodities} />
          </div>

          {/* Quick Stats Panel - Takes 1/3 on desktop */}
          <div className="glass-premium-strong p-8">
            <div className="space-y-8">
              {/* Portfolio Value */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Total Portfolio Value</p>
                <div className="relative">
                  <h2 className="text-5xl sm:text-7xl font-black text-white font-mono mb-4 tracking-tight bg-clip-text">
                    ${portfolioValue.total.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </h2>
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 rounded-lg blur-lg opacity-50 -z-10"></div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">24h Change</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-green-400 font-mono">
                        +${portfolioValue.change24h.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-lg font-semibold text-green-400">
                        ({portfolioValue.changePercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg glass-premium border-green-500/30 w-fit hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-500/75"></div>
                  <p className="text-green-300 text-xs font-semibold uppercase tracking-widest">Live & Updating</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-blue-500/60 transition duration-500 transform hover:scale-105 active:scale-98 relative overflow-hidden group ease-premium">
                  <span className="relative z-10">View Prices</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 transform translate-x-full group-hover:translate-x-0 transition duration-700"></div>
                </button>
                <button className="w-full px-6 py-4 border-2 border-blue-500/50 text-blue-300 font-bold rounded-lg hover:bg-blue-500/10 hover:border-blue-400 transition duration-500 ease-premium transform hover:scale-105 active:scale-98">
                  Set Alerts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Commodity Filter Tabs */}
        <div className="mb-8 flex gap-3 border-b border-white/10 pb-4 overflow-x-auto">
          {['All Commodities', 'Metals', 'Energy', 'Agriculture'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2.5 font-semibold text-sm whitespace-nowrap transition-all duration-300 ease-premium relative rounded-lg ${
                tab === 'All Commodities'
                  ? 'text-white bg-blue-500/10 border border-blue-500/30'
                  : 'text-gray-400 hover:text-gray-200 border border-transparent hover:border-white/10 hover:bg-white/5'
              }`}
            >
              {tab}
              {tab === 'All Commodities' && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 pointer-events-none"></div>
              )}
            </button>
          ))}
        </div>

        {/* Price Cards Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">Commodities</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Live Market Data — 24 Assets</p>
            </div>
            <button className="px-4 py-2 text-blue-300 text-sm font-semibold hover:text-blue-200 hover:bg-blue-500/10 border border-blue-500/30 rounded-lg transition-all duration-300 ease-premium hover:border-blue-500/50">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {commodities.map((commodity) => (
              <PriceCard
                key={commodity.id}
                name={commodity.name}
                symbol={commodity.symbol}
                currentPrice={commodity.currentPrice}
                change24h={commodity.change24h}
                sentiment={commodity.sentiment}
                volatility={commodity.volatility}
                emoji={commodity.emoji}
                priceHistory={
                  mockPriceHistory[commodity.id as keyof typeof mockPriceHistory] || []
                }
              />
            ))}
          </div>
        </div>

        {/* News Feed Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* News Feed - Takes 2/3 on desktop */}
          <div className="lg:col-span-2 glass-premium-strong p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Latest News</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Market Intel — Real-Time Updates</p>
              </div>
              <button className="px-4 py-2 text-blue-300 text-sm font-semibold hover:text-blue-200 hover:bg-blue-500/10 border border-blue-500/30 rounded-lg transition-all duration-300 ease-premium hover:border-blue-500/50">
                See All →
              </button>
            </div>
            <NewsFeed news={mockNews} />
          </div>

          {/* Sentiment Summary - Takes 1/3 on desktop */}
          <div className="glass-premium-strong p-8">
            <h3 className="text-xl font-bold text-white mb-6">Sentiment Overview</h3>

            <div className="space-y-3">
              {/* Bullish Card */}
              <div className="group rounded-lg p-4 border border-white/5 bg-gradient-to-r from-green-500/5 to-transparent hover:border-green-500/30 hover:bg-green-500/10 transition-all duration-300 ease-premium cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-lg shadow-green-500/50"></div>
                    <span className="text-sm font-semibold text-gray-300">Bullish</span>
                  </div>
                  <span className="text-lg font-black text-green-400">50%</span>
                </div>
                <div className="w-full bg-gray-700/20 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full shadow-lg shadow-green-500/50" style={{ width: '50%' }}></div>
                </div>
              </div>

              {/* Bearish Card */}
              <div className="group rounded-lg p-4 border border-white/5 bg-gradient-to-r from-red-500/5 to-transparent hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-300 ease-premium cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-lg shadow-red-500/50"></div>
                    <span className="text-sm font-semibold text-gray-300">Bearish</span>
                  </div>
                  <span className="text-lg font-black text-red-400">25%</span>
                </div>
                <div className="w-full bg-gray-700/20 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-400 h-full rounded-full shadow-lg shadow-red-500/50" style={{ width: '25%' }}></div>
                </div>
              </div>

              {/* Neutral Card */}
              <div className="group rounded-lg p-4 border border-white/5 bg-gradient-to-r from-amber-500/5 to-transparent hover:border-amber-500/30 hover:bg-amber-500/10 transition-all duration-300 ease-premium cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-lg shadow-amber-500/50"></div>
                    <span className="text-sm font-semibold text-gray-300">Neutral</span>
                  </div>
                  <span className="text-lg font-black text-amber-400">25%</span>
                </div>
                <div className="w-full bg-gray-700/20 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full shadow-lg shadow-amber-500/50" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition duration-500 ease-premium transform hover:scale-103 active:scale-98">
                Upgrade to Pro
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">Unlock advanced analytics</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">CommodityBubbles</h4>
              <p className="text-gray-400 text-xs leading-relaxed">Real-time commodity market intelligence for modern traders.</p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="text-gray-400 text-xs hover:text-blue-400 transition duration-300">
                  Privacy Policy
                </a>
                <br />
                <a href="#" className="text-gray-400 text-xs hover:text-blue-400 transition duration-300">
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <p className="text-gray-400 text-xs">
                Questions? Reach out at
                <br />
                <a href="mailto:support@example.com" className="text-blue-400 hover:text-blue-300 transition">
                  support@example.com
                </a>
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-500 text-xs">
            <p>© 2026 CommodityBubbles. All rights reserved.</p>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-500/50"></span>
              <span className="text-gray-400">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
