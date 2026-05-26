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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1135] to-[#1a0f2e]">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
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
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Total Portfolio Value</p>
                <h2 className="text-5xl sm:text-6xl font-black text-white font-mono mb-4 tracking-tight">
                  ${portfolioValue.total.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </h2>

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
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 w-fit">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  <p className="text-green-300 text-sm font-semibold uppercase tracking-wider">Live & Updating</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition duration-500 transform hover:scale-103 active:scale-98 relative overflow-hidden group ease-premium">
                  <span className="relative z-10">View Prices</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-full group-hover:translate-x-0 transition duration-700"></div>
                </button>
                <button className="w-full px-6 py-4 border-2 border-blue-500 text-blue-400 font-bold rounded-lg hover:bg-blue-500/10 transition duration-500 ease-premium transform hover:scale-103 active:scale-98">
                  Set Alerts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Commodity Filter Tabs */}
        <div className="mb-8 flex gap-2 border-b border-white/10 pb-4 overflow-x-auto">
          {['All Commodities', 'Metals', 'Energy', 'Agriculture'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 font-semibold text-sm whitespace-nowrap transition-all duration-300 ease-premium relative ${
                tab === 'All Commodities'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
              {tab === 'All Commodities' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0 shadow-lg shadow-blue-500/50"></div>
              )}
            </button>
          ))}
        </div>

        {/* Price Cards Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-black text-white mb-1">Commodities</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Live Market Data</p>
            </div>
            <button className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition">
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Latest News</h2>
              <button className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition">
                See All →
              </button>
            </div>
            <NewsFeed news={mockNews} />
          </div>

          {/* Sentiment Summary - Takes 1/3 on desktop */}
          <div className="glass-premium-strong p-8">
            <h3 className="text-xl font-bold text-white mb-6">Sentiment Summary</h3>

            <div className="space-y-4">
              {/* Bullish */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-lg">📈</span> Bullish
                  </span>
                  <span className="text-white font-semibold">50%</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>

              {/* Bearish */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-lg">📉</span> Bearish
                  </span>
                  <span className="text-white font-semibold">25%</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              {/* Neutral */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-lg">➡️</span> Neutral
                  </span>
                  <span className="text-white font-semibold">25%</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '25%' }}></div>
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
      <footer className="mt-12 py-6 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-gray-500 text-xs">
            <p>© 2026 CommodityBubbles. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-gray-300 transition">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-300 transition">
                Terms
              </a>
              <a href="#" className="hover:text-gray-300 transition">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
