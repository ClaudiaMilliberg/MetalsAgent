'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BubbleMap from '@/components/BubbleMap';
import PriceCard from '@/components/PriceCard';
import NewsFeed from '@/components/NewsFeed';
import NavTabs from '@/components/NavTabs';
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
    <div className="min-h-screen bg-gradient-to-br from-[#030409] via-[#0a0d1f] to-[#0d0920] text-white relative overflow-hidden">
      {/* Ultra-premium cinematic background layers with enhanced depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Very faint radial grid - almost invisible spatial reference */}
        <div className="absolute inset-0 opacity-[0.01]" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0.5px, transparent 0.5px)',
          backgroundSize: '120px 120px'
        }}></div>

        {/* PRIMARY ATMOSPHERIC ORB - Top Right (Blue dominant with enhanced glow) */}
        <div className="absolute -top-96 -right-96 w-[950px] h-[950px] rounded-full opacity-65 animate-pulse" style={{
          animationDuration: '8s',
          background: 'radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.1) 50%, transparent 100%)',
          filter: 'blur(80px)',
          boxShadow: '0 0 180px rgba(59, 130, 246, 0.3), inset 0 0 120px rgba(59, 130, 246, 0.2), 0 0 60px rgba(37, 99, 235, 0.15)'
        }}></div>

        {/* SECONDARY ATMOSPHERIC ORB - Bottom Left (Cyan with rim light) */}
        <div className="absolute -bottom-72 -left-72 w-[750px] h-[750px] rounded-full opacity-55" style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(34, 211, 238, 0.35) 0%, rgba(34, 211, 238, 0.1) 45%, transparent 100%)',
          filter: 'blur(90px)',
          animation: 'float 16s ease-in-out infinite',
          boxShadow: '0 0 140px rgba(34, 211, 238, 0.25), inset 0 0 80px rgba(34, 211, 238, 0.15), 0 0 50px rgba(6, 182, 212, 0.2)'
        }}></div>

        {/* TERTIARY ATMOSPHERIC ORB - Center-left (Purple with depth) */}
        <div className="absolute top-1/3 left-1/4 w-[550px] h-[550px] rounded-full opacity-45" style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(168, 85, 247, 0.25) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 100%)',
          filter: 'blur(85px)',
          animation: 'float-reverse 22s ease-in-out infinite',
          boxShadow: '0 0 110px rgba(168, 85, 247, 0.2), inset 0 0 70px rgba(168, 85, 247, 0.12)'
        }}></div>

        {/* FOURTH ORB - Right center accent (Cyan rim) */}
        <div className="absolute top-1/2 -right-36 w-[450px] h-[450px] rounded-full opacity-40" style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 100%)',
          filter: 'blur(75px)',
          animation: 'float 28s ease-in-out infinite',
          boxShadow: '0 0 100px rgba(6, 182, 212, 0.25), inset 0 0 60px rgba(6, 182, 212, 0.15)'
        }}></div>

        {/* Depth vignette - edges darker with smooth falloff */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 180% 80% at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.2) 40%, rgba(0, 0, 0, 0.6) 100%)',
          pointerEvents: 'none'
        }}></div>

        {/* Subtle noise texture overlay - barely visible */}
        <div className="absolute inset-0 opacity-[0.01]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="5" seed="2" /%3E%3C/filter%3E%3Crect width="400" height="400" fill="%23000" filter="url(%23noiseFilter)" /%3E%3C/svg%3E")',
          backgroundSize: '500px 500px'
        }}></div>

        {/* Bottom edge light leak (subtle) */}
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none" style={{
          background: 'linear-gradient(to top, rgba(59, 130, 246, 0.08) 0%, transparent 100%)',
          filter: 'blur(40px)'
        }}></div>
      </div>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Hero Section with Bubble Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 sm:mb-12">
          {/* Bubble Map - Takes 2/3 on desktop */}
          <div className="lg:col-span-2 h-72 sm:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <BubbleMap commodities={commodities} />
          </div>

          {/* Quick Stats Panel - Takes 1/3 on desktop */}
          <div className="glass-premium-strong p-6 sm:p-8 rounded-2xl shadow-2xl">
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
                <button className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm sm:text-base rounded-lg hover:shadow-2xl hover:shadow-blue-500/60 transition duration-500 transform hover:scale-105 active:scale-98 relative overflow-hidden group ease-premium shadow-lg">
                  <span className="relative z-10">View Prices</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 transform translate-x-full group-hover:translate-x-0 transition duration-700"></div>
                </button>
                <button className="w-full px-6 py-3 sm:py-4 border-2 border-blue-500/50 text-blue-300 font-bold text-sm sm:text-base rounded-lg hover:bg-blue-500/10 hover:border-blue-400 transition duration-500 ease-premium transform hover:scale-105 active:scale-98 bg-blue-500/5">
                  Set Alerts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Navigation Tabs - Control Surface */}
        <NavTabs onTabChange={(label) => console.log('Tab changed:', label)} />

        {/* Price Cards Grid */}
        <div className="mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight">Commodities</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Live Market Data — Real-Time Prices</p>
            </div>
            <button className="px-4 py-2 text-blue-300 text-sm font-semibold hover:text-blue-200 hover:bg-blue-500/10 border border-blue-500/30 rounded-lg transition-all duration-300 ease-premium hover:border-blue-500/50 hidden sm:block">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* News Feed - Takes 2/3 on desktop */}
          <div className="lg:col-span-2 glass-premium-strong p-6 sm:p-8 rounded-2xl shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight">Latest News</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Market Intel — Real-Time Updates</p>
              </div>
              <button className="px-4 py-2 text-blue-300 text-sm font-semibold hover:text-blue-200 hover:bg-blue-500/10 border border-blue-500/30 rounded-lg transition-all duration-300 ease-premium hover:border-blue-500/50 hidden sm:block">
                See All →
              </button>
            </div>
            <NewsFeed news={mockNews} />
          </div>

          {/* Sentiment Summary - Takes 1/3 on desktop */}
          <div className="glass-premium-strong p-6 sm:p-8 rounded-2xl shadow-2xl">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">Sentiment Overview</h3>

            <div className="space-y-4 sm:space-y-5">
              {/* Bullish Card */}
              <div className="group rounded-lg p-5 border border-white/10 bg-gradient-to-r from-green-500/5 to-transparent hover:border-green-500/40 hover:bg-green-500/15 transition-all duration-300 ease-premium cursor-pointer hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-lg shadow-green-500/50"></div>
                    <span className="text-sm font-semibold text-gray-300">Bullish</span>
                  </div>
                  <span className="text-lg font-black text-green-400">50%</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full shadow-lg shadow-green-500/60 transition-all duration-500" style={{ width: '50%' }}></div>
                </div>
              </div>

              {/* Bearish Card */}
              <div className="group rounded-lg p-5 border border-white/10 bg-gradient-to-r from-red-500/5 to-transparent hover:border-red-500/40 hover:bg-red-500/15 transition-all duration-300 ease-premium cursor-pointer hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-lg shadow-red-500/50"></div>
                    <span className="text-sm font-semibold text-gray-300">Bearish</span>
                  </div>
                  <span className="text-lg font-black text-red-400">25%</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-400 h-full rounded-full shadow-lg shadow-red-500/60 transition-all duration-500" style={{ width: '25%' }}></div>
                </div>
              </div>

              {/* Neutral Card */}
              <div className="group rounded-lg p-5 border border-white/10 bg-gradient-to-r from-amber-500/5 to-transparent hover:border-amber-500/40 hover:bg-amber-500/15 transition-all duration-300 ease-premium cursor-pointer hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-lg shadow-amber-500/50"></div>
                    <span className="text-sm font-semibold text-gray-300">Neutral</span>
                  </div>
                  <span className="text-lg font-black text-amber-400">25%</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full shadow-lg shadow-amber-500/60 transition-all duration-500" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10">
              <button className="w-full px-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm sm:text-base rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition duration-500 ease-premium transform hover:scale-105 active:scale-98 shadow-md">
                Upgrade to Pro
              </button>
              <p className="text-xs text-gray-500 text-center mt-3 sm:mt-4">Unlock advanced analytics</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 sm:mt-20 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
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
                <div>
                  <a href="#" className="text-gray-400 text-xs hover:text-blue-400 transition duration-300">
                    Privacy Policy
                  </a>
                </div>
                <div>
                  <a href="#" className="text-gray-400 text-xs hover:text-blue-400 transition duration-300">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Support</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Questions? Reach out at
                <br />
                <a href="mailto:support@example.com" className="text-blue-400 hover:text-blue-300 transition font-semibold">
                  support@example.com
                </a>
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 text-gray-500 text-xs">
            <p>© 2026 CommodityBubbles. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-500/50"></span>
              <span className="text-gray-400">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
