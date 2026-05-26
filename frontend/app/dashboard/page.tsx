'use client';

import { useCommodities } from '@/hooks/useCommodities';
import { CommodityCard } from './components/CommodityCard';

export default function Dashboard() {
  const { commodities, projects, sentiment, loading, error, lastPriceUpdate, lastSentimentUpdate } =
    useCommodities();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💎 CommodityBubbles</h1>
          <p className="text-slate-400">
            Real-time commodity intelligence • Infrastructure tracking • Live sentiment
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
            ⚠️ {error}
          </div>
        )}

        {/* Update Status */}
        <div className="mb-6 flex gap-4 text-sm text-slate-400">
          <div>
            Prices: {lastPriceUpdate ? `${lastPriceUpdate.toLocaleTimeString()}` : 'Loading...'}
          </div>
          <div>•</div>
          <div>
            Sentiment:{' '}
            {lastSentimentUpdate ? `${lastSentimentUpdate.toLocaleTimeString()}` : 'Loading...'}
          </div>
        </div>

        {/* Commodity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {commodities.map((commodity) => (
            <CommodityCard
              key={commodity.id}
              commodity={commodity}
              sentimentData={sentiment[commodity.id.toLowerCase()]}
            />
          ))}
        </div>

        {/* Infrastructure Projects */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">🏗️ Infrastructure Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <div
                key={project.id}
                className="rounded-lg border border-slate-700 backdrop-blur-sm p-4 bg-slate-800/50 hover:bg-slate-700/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">
                      {project.type === 'mining' && '⛏️'}
                      {project.type === 'dam' && '🏊'}
                      {project.type === 'desalination' && '💧'}
                      {project.type === 'reactor' && '⚛️'} {project.type}
                    </p>
                    <p className="text-lg font-semibold text-white">{project.name}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      project.status === 'operation'
                        ? 'bg-green-900/50 text-green-300'
                        : project.status === 'construction'
                        ? 'bg-yellow-900/50 text-yellow-300'
                        : 'bg-slate-700/50 text-slate-300'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="text-sm text-slate-300 mb-3">
                  <p>📍 {project.location}, {project.country}</p>
                  <p>💰 ${project.investmentBillion}B investment</p>
                  <p>
                    📊{' '}
                    {project.impactOnPrice > 0 ? '+' : ''}
                    {project.impactOnPrice}% price impact
                  </p>
                </div>

                <div className="text-xs text-slate-400 pt-3 border-t border-slate-700">
                  Completion: {new Date(project.completionDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with API Status */}
        <div className="text-center text-slate-500 text-xs pt-8 border-t border-slate-700">
          <p>
            Prices update every 30 seconds • Sentiment updates hourly • API quota: 72 calls/day
            (free tier: 100-500)
          </p>
        </div>
      </div>
    </div>
  );
}
