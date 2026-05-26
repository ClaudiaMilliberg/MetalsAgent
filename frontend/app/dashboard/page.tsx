'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BubbleMap from '@/components/BubbleMap';
import PriceCard from '@/components/PriceCard';
import NewsFeed from '@/components/NewsFeed';
import { mockCommodities, mockNews, mockPriceHistory, mockPortfolioValue } from '@/lib/mockData';
import { getCommodityPrices } from '@/lib/commodityPriceService';

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
    const loadPrices = async () => {
      try {
        // Attempt to fetch real commodity prices from Finnhub API
        const apiPrices = await getCommodityPrices('finnhub');

        // If API returns data, use it; otherwise fall back to mock data
        if (apiPrices && apiPrices.length > 0) {
          setCommodities(apiPrices);
        } else {
          setCommodities(mockCommodities);
        }
      } catch (error) {
        console.error('Error fetching commodity prices, using mock data:', error);
        setCommodities(mockCommodities);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrices();
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
    <div className="min-h-screen bg-gradient-to-br from-[#030810] via-[#0a0e1f] to-[#0f0820] text-white relative overflow-hidden">
      {/* Ultra-deep cinematic background layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Radial grid structure - subtle spatial reference */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}></div>

        {/* Primary atmospheric orb - top right */}
        <div className="absolute -top-64 -right-64 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl opacity-40 animate-pulse" style={{
          animationDuration: '8s'
        }}></div>

        {/* Secondary atmospheric orb - bottom left */}
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl opacity-30" style={{
          animation: 'float 15s ease-in-out infinite'
        }}></div>

        {/* Tertiary atmospheric orb - center */}
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-3xl opacity-20" style={{
          animation: 'float-reverse 20s ease-in-out infinite'
        }}></div>

        {/* Vignette effect - edges darker */}
        <div className="absolute inset-0 bg-radial-gradient" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
          pointerEvents: 'none'
        }}></div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="400" height="400" filter="url(%23noiseFilter)" /%3E%3C/svg%3E")',
          backgroundSize: '400px 400px'
        }}></div>
      </div>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
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
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-black text-white font-mono mb-4 tracking-tight bg-clip-text leading-tight">
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

        {/* Premium Navigation Tabs - Control Surface */}
        <div className="mb-12 flex gap-2 border-b border-white/10 pb-6 overflow-x-auto group">
          {[
            { label: 'All Commodities', icon: '⊚' },
            { label: 'Metals', icon: '▪' },
            { label: 'Energy', icon: '⚡' },
            { label: 'Agriculture', icon: '🌾' }
          ].map((tab) => (
            <button
              key={tab.label}
              className={`
                relative px-5 py-3 font-semibold text-sm whitespace-nowrap transition-all duration-300 ease-premium
                rounded-lg border flex items-center gap-2.5
                ${
                  tab.label === 'All Commodities'
                    ? `
                      text-white bg-gradient-to-b from-blue-500/20 to-blue-500/5 border border-blue-400/50
                      shadow-lg shadow-blue-500/20
                      before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-blue-400/0 before:via-white/5 before:to-blue-400/0 before:animate-shimmer
                      after:absolute after:top-0 after:inset-x-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-blue-400 after:to-transparent
                      hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-500/30
                    `
                    : `
                      text-gray-400 hover:text-gray-200 border border-transparent hover:border-white/20
                      hover:bg-white/5 hover:text-white
                    `
                }
              `}
            >
              <span className="text-lg opacity-70">{tab.icon}</span>
              <span className="relative z-10">{tab.label}</span>

              {tab.label === 'All Commodities' && (
                <>
                  <div className="absolute inset-0 rounded-lg ring-1 ring-blue-400/50 pointer-events-none"></div>
                  <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Price Cards Grid */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">Commodities</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Live Market Data — Real-Time Prices</p>
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
          <div className="lg:col-span-2 glass-premium-strong p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">Latest News</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Market Intel — Real-Time Updates</p>
              </div>
              <button className="px-4 py-2 text-blue-300 text-sm font-semibold hover:text-blue-200 hover:bg-blue-500/10 border border-blue-500/30 rounded-lg transition-all duration-300 ease-premium hover:border-blue-500/50">
                See All →
              </button>
            </div>
            <NewsFeed news={mockNews} />
          </div>

          {/* Sentiment Summary - Takes 1/3 on desktop */}
          <div className="glass-premium-strong p-6 sm:p-8">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-6 leading-tight">Sentiment Overview</h3>

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
      <footer className="mt-20 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-12">
            {/* Company */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">CommodityBubbles</h4>
              <p className="text-gray-400 text-xs leading-relaxed">Real-time commodity market intelligence for modern traders.</p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Legal</h4>
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
              <h4 className="text-white font-bold text-lg mb-4">Support</h4>
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
