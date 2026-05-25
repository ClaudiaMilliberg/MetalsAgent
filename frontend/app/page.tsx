'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      setUser(session.user);
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary to-gray-900 px-4">
      {/* Hero Section */}
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          CommodityBubbles
        </h1>
        <p className="text-xl text-secondary mb-8">
          Real-time bubble map visualization of commodity markets with AI-powered sentiment analysis
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/auth/login')}
            className="px-8 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-blue-400 transition"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/auth/signup')}
            className="px-8 py-3 border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent hover:text-primary transition"
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Feature Overview */}
      <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl">
        <div className="bg-dark backdrop-blur border border-gray-700 p-6 rounded-lg">
          <div className="text-accent text-3xl mb-3">🫧</div>
          <h3 className="text-lg font-semibold text-white mb-2">Bubble Map</h3>
          <p className="text-secondary text-sm">Real-time visualization of commodity markets with color-coded sentiment</p>
        </div>
        <div className="bg-dark backdrop-blur border border-gray-700 p-6 rounded-lg">
          <div className="text-accent text-3xl mb-3">📊</div>
          <h3 className="text-lg font-semibold text-white mb-2">AI Sentiment</h3>
          <p className="text-secondary text-sm">Claude-powered analysis of news headlines and social sentiment</p>
        </div>
        <div className="bg-dark backdrop-blur border border-gray-700 p-6 rounded-lg">
          <div className="text-accent text-3xl mb-3">🤖</div>
          <h3 className="text-lg font-semibold text-white mb-2">Bot Signals</h3>
          <p className="text-secondary text-sm">Connect your trading bot and track signals in real-time</p>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="mt-20 max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Simple Pricing</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-dark backdrop-blur border border-gray-700 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
            <p className="text-4xl font-bold text-accent mb-6">$1<span className="text-lg text-secondary">/mo</span></p>
            <ul className="text-secondary text-sm space-y-2 mb-8">
              <li>✓ Real-time bubble map</li>
              <li>✓ AI sentiment analysis</li>
              <li>✓ Bot signal integration</li>
              <li>✓ Unlimited alerts</li>
            </ul>
            <button className="w-full px-6 py-2 bg-accent text-primary font-semibold rounded hover:bg-blue-400 transition">
              Choose Plan
            </button>
          </div>
          <div className="bg-dark backdrop-blur border border-accent p-8 rounded-lg">
            <div className="text-accent text-sm font-semibold mb-2">POPULAR</div>
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
            <p className="text-4xl font-bold text-accent mb-6">$25<span className="text-lg text-secondary">/mo</span></p>
            <ul className="text-secondary text-sm space-y-2 mb-8">
              <li>✓ All Pro features</li>
              <li>✓ 2-year historical data</li>
              <li>✓ API access</li>
              <li>✓ White-label option</li>
            </ul>
            <button className="w-full px-6 py-2 bg-accent text-primary font-semibold rounded hover:bg-blue-400 transition">
              Choose Plan
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 text-center text-secondary text-sm">
        <p>© 2026 CommodityBubbles. All rights reserved.</p>
      </div>
    </div>
  );
}
