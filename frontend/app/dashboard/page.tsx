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
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Bubble Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bubble Map - Takes 2/3 on desktop */}
          <div className="lg:col-span-2 h-96 lg:h-[500px]">
            <BubbleMap commodities={commodities} />
          </div>

          {/* Quick Stats Panel - Takes 1/3 on desktop */}
          <div className="bg-gradient-to-br from-secondary to-primary border border-gray-700/50 rounded-2xl p-6 backdrop-blur">
            <div className="space-y-6">
              {/* Portfolio Value */}
              <div>
                <p className="text-gray-400 text-sm mb-2">Portfolio Value</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white font-mono mb-2">
                  ${portfolioValue.total.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-green-400">
                    +${portfolioValue.change24h.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-lg font-semibold text-green-400">
                    ({portfolioValue.changePercent.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="pt-6 border-t border-gray-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-400 text-sm">Market Status</p>
                </div>
                <p className="text-white font-semibold">Live & Updating</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-700/50 space-y-3">
                <button className="w-full px-4 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-blue-400 transition transform hover:scale-105 active:scale-95">
                  View Prices
                </button>
                <button className="w-full px-4 py-3 border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent hover:text-primary transition transform hover:scale-105 active:scale-95">
                  Set Alerts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Price Cards Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Commodities</h2>
            <button className="text-accent text-sm font-semibold hover:text-blue-300 transition">
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
          <div className="lg:col-span-2 bg-gradient-to-br from-secondary to-primary border border-gray-700/50 rounded-2xl p-6 backdrop-blur">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Latest News</h2>
              <button className="text-accent text-sm font-semibold hover:text-blue-300 transition">
                See All →
              </button>
            </div>
            <NewsFeed news={mockNews} />
          </div>

          {/* Sentiment Summary - Takes 1/3 on desktop */}
          <div className="bg-gradient-to-br from-secondary to-primary border border-gray-700/50 rounded-2xl p-6 backdrop-blur">
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

            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-accent to-blue-500 text-primary font-semibold rounded-lg hover:shadow-lg transition transform hover:scale-105 active:scale-95">
                Upgrade to Pro
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">Unlock advanced analytics</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-700/30">
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
