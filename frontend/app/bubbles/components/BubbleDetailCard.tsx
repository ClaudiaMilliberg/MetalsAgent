'use client';

import { motion } from 'framer-motion';

interface Commodity {
  id: string;
  name: string;
  price: number;
  change24h: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  volatility: number;
  signalBreakdown: {
    reddit: number;
    news: number;
    twitter: number;
    onchain: number;
  };
  headlines: string[];
  demand: string;
  confidence: number;
}

export default function BubbleDetailCard({ commodity }: { commodity: Commodity }) {
  const sentimentColor = {
    bullish: 'text-emerald-400',
    bearish: 'text-red-400',
    neutral: 'text-amber-400',
  }[commodity.sentiment];

  const sentimentBg = {
    bullish: 'bg-emerald-900/20 border-emerald-500/30',
    bearish: 'bg-red-900/20 border-red-500/30',
    neutral: 'bg-amber-900/20 border-amber-500/30',
  }[commodity.sentiment];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`rounded-2xl border backdrop-blur-2xl p-8 h-96 overflow-y-auto shadow-2xl transition-all duration-300
        ${sentimentBg} border-white/20 bg-glass-dark`}
    >
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-white/10">
        <motion.h2
          className="text-3xl font-bold text-white mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {commodity.name.toUpperCase()}
        </motion.h2>
        <div className="flex items-baseline gap-4">
          <p className="text-5xl font-bold text-white font-mono tracking-tight">${commodity.price.toFixed(2)}</p>
          <p className={`text-lg font-semibold ${commodity.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {commodity.change24h >= 0 ? '+' : ''}
            {commodity.change24h.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Sentiment */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className={`text-xs font-bold ${sentimentColor} uppercase mb-3 tracking-widest`}>{commodity.sentiment}</p>
        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
          <motion.div
            className={`h-full rounded-full transition-all ${
              commodity.sentiment === 'bullish'
                ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                : commodity.sentiment === 'bearish'
                ? 'bg-red-500 shadow-lg shadow-red-500/50'
                : 'bg-amber-500 shadow-lg shadow-amber-500/50'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${commodity.score}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
          ></motion.div>
        </div>
        <p className="text-xs text-white/60 mt-2 font-mono">Score: {commodity.score.toFixed(0)}/100</p>
      </motion.div>

      {/* Signal Breakdown */}
      <div className="mb-4 pb-4 border-b border-slate-600">
        <p className="text-xs font-semibold text-slate-300 uppercase mb-3">Signal Breakdown</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">🔴 Reddit</span>
            <span className="text-slate-400">{commodity.signalBreakdown.reddit}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded h-1">
            <div
              className="h-full rounded bg-orange-600"
              style={{ width: `${commodity.signalBreakdown.reddit}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs mt-3">
            <span className="text-slate-300">📰 News</span>
            <span className="text-slate-400">{commodity.signalBreakdown.news}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded h-1">
            <div
              className="h-full rounded bg-white/50"
              style={{ width: `${commodity.signalBreakdown.news}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs mt-3">
            <span className="text-slate-300">𝕏 Twitter</span>
            <span className="text-slate-400">{commodity.signalBreakdown.twitter}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded h-1">
            <div
              className="h-full rounded bg-blue-600"
              style={{ width: `${commodity.signalBreakdown.twitter}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs mt-3">
            <span className="text-slate-300">⛓️ On-chain</span>
            <span className="text-slate-400">{commodity.signalBreakdown.onchain}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded h-1">
            <div
              className="h-full rounded bg-purple-600"
              style={{ width: `${commodity.signalBreakdown.onchain}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Headlines */}
      {commodity.headlines.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-300 uppercase mb-2">Top Headlines</p>
          <div className="space-y-2 text-xs">
            {commodity.headlines.slice(0, 3).map((headline, i) => (
              <p key={i} className="text-slate-300 line-clamp-2">
                • {headline}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Demand & Confidence */}
      <motion.div
        className="text-xs text-white/70 space-y-2 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p>
          <span className="font-bold text-white/90">Demand:</span> {commodity.demand}
        </p>
        <p>
          <span className="font-bold text-white/90">7-day Confidence:</span>{' '}
          {commodity.confidence.toFixed(0)}%
        </p>
      </motion.div>
    </motion.div>
  );
}
