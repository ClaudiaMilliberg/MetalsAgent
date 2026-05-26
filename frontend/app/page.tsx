'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Home() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [authMode, setAuthMode] = useState<'landing' | 'signin' | 'signup'>('landing');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleCheckout = async (tier: 'pro' | 'enterprise') => {
    if (!email) {
      setAuthMode('signup');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, user_id: email, email }),
      });
      const data = await res.json();
      if (data.checkout_url) window.location.href = data.checkout_url;
    } catch (e) {
      setError('Something went wrong. Please try again.');
    }
    setAuthLoading(false);
  };

  const handleSignIn = async () => {
    setAuthLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push('/dashboard');
    setAuthLoading(false);
  };

  const handleSignUp = async () => {
    setAuthLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setAuthMode('landing');
    setAuthLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,200,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold">C</div>
          <span className="font-semibold text-lg tracking-tight">CommodityBubbles</span>
        </div>
        <button
          onClick={() => setAuthMode('signin')}
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          Sign In
        </button>
      </nav>

      {authMode !== 'landing' ? (
        /* Auth Modal */
        <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-6">{authMode === 'signin' ? 'Sign In' : 'Create Account'}</h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-cyan-400/50 transition-colors"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-cyan-400/50 transition-colors"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={authMode === 'signin' ? handleSignIn : handleSignUp}
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {authLoading ? 'Loading...' : authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="w-full text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                {authMode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
              <button onClick={() => setAuthMode('landing')} className="w-full text-sm text-white/30 hover:text-white/50 transition-colors">← Back</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero */}
          <div className="relative z-10 max-w-6xl mx-auto px-8 pt-24 pb-16 text-center">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-4 py-1.5 text-xs text-cyan-400 mb-8">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              Live Infrastructure Market Intelligence
            </div>

            <h1 className="text-6xl font-bold tracking-tight mb-6 leading-tight">
              Predict commodity<br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">movements before</span><br />
              they happen
            </h1>

            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
              AI-powered signal intelligence for copper, nickel, gold and infrastructure metals. Aggregates Reddit, news, on-chain data and macro indicators into actionable predictions.
            </p>

            {/* Signal stats */}
            <div className="flex items-center justify-center gap-12 mb-16">
              {[
                { label: 'Signal Sources', value: '6' },
                { label: 'Metals Tracked', value: '9' },
                { label: 'Prediction Accuracy', value: '73%' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">{stat.value}</div>
                  <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Trial */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-left hover:border-white/20 transition-colors">
                <div className="text-sm text-white/40 mb-2">Trial Access</div>
                <div className="text-4xl font-bold mb-1">$1</div>
                <div className="text-sm text-white/40 mb-6">one-time</div>
                <ul className="space-y-3 mb-8">
                  {['Live bubble map', 'News sentiment feed', '7-day signal history', 'All 9 metals'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                      <span className="text-cyan-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-cyan-400/50 transition-colors mb-3"
                />
                <button
                  onClick={() => handleCheckout('pro')}
                  disabled={authLoading}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 text-sm font-semibold hover:bg-white/15 transition-colors disabled:opacity-50"
                >
                  Start Trial →
                </button>
              </div>

              {/* Pro */}
              <div className="bg-gradient-to-b from-cyan-500/10 to-blue-600/10 border border-cyan-400/30 rounded-2xl p-8 text-left relative">
                <div className="absolute top-4 right-4 bg-cyan-400 text-black text-xs font-bold px-2 py-1 rounded-full">POPULAR</div>
                <div className="text-sm text-cyan-400 mb-2">Full Access</div>
                <div className="text-4xl font-bold mb-1">$20</div>
                <div className="text-sm text-white/40 mb-6">per month</div>
                <ul className="space-y-3 mb-8">
                  {['Everything in Trial', 'AI prediction engine', 'Reddit + X signal fusion', 'Infrastructure sector mapping', 'Volatility alerts', 'Pattern recognition'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                      <span className="text-cyan-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-cyan-400/50 transition-colors mb-3"
                />
                <button
                  onClick={() => handleCheckout('enterprise')}
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Get Full Access →
                </button>
              </div>
            </div>

            {/* Social proof */}
            <div className="mt-16 flex items-center justify-center gap-2 text-sm text-white/30">
              <span>Powered by</span>
              <span className="text-orange-400">Reddit</span>
              <span>·</span>
              <span className="text-blue-400">X</span>
              <span>·</span>
              <span className="text-white/50">LME</span>
              <span>·</span>
              <span className="text-white/50">CME</span>
              <span>·</span>
              <span className="text-white/50">GDELT</span>
              <span>·</span>
              <span className="text-white/50">Whale Alert</span>
            </div>
          </div>
        </>
      )}

      <div className="relative z-10 text-center text-white/20 text-xs pb-8">
        © 2026 CommodityBubbles. All rights reserved.
      </div>
    </div>
  );
}
