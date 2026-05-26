'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MineMap = dynamic(() => import('./components/MineMap'), { ssr: false });
const DisruptionPanel = dynamic(() => import('./components/DisruptionPanel'), { ssr: false });

interface Disruption {
  id: string;
  location: string;
  type: string;
  affectedOutput: number;
  priceImpact: number;
  severity: 'critical' | 'moderate' | 'minor';
  daysAgo: number;
}

export default function MinesPage() {
  const [disruptions, setDisruptions] = useState<Disruption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisruptions = async () => {
      try {
        const res = await fetch('/api/mines/disruptions');
        const data = await res.json();
        setDisruptions(data.disruptions || []);
      } catch (error) {
        console.error('Failed to fetch disruptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisruptions();
    const interval = setInterval(fetchDisruptions, 10 * 60 * 1000); // Refresh every 10 min
    return () => clearInterval(interval);
  }, []);

  const totalDisruptionPercent = disruptions.reduce((sum, d) => sum + d.affectedOutput, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⛏️ Global Copper Mine Map</h1>
          <p className="text-slate-400">
            Real-time mine tracking, disruption alerts, and supply chain impact analysis
          </p>
        </div>

        {/* Supply at Risk Card */}
        <div className={`mb-6 p-6 rounded-lg border ${
          totalDisruptionPercent > 15 ? 'bg-red-900/20 border-red-500/50' : 'bg-slate-800/50 border-slate-700'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Global Supply at Risk</p>
              <p className="text-3xl font-bold text-white">
                {totalDisruptionPercent.toFixed(1)}%
              </p>
              <p className="text-xs text-slate-400 mt-1">{disruptions.length} active disruptions</p>
            </div>
            <div className="text-5xl">{totalDisruptionPercent > 15 ? '🚨' : '✅'}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden h-96">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                  <p className="text-slate-400">Loading map...</p>
                </div>
              ) : (
                <MineMap selectedRegion={selectedRegion} />
              )}
            </div>

            {/* Region Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedRegion(null)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedRegion === null
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                🌍 Global
              </button>
              <button
                onClick={() => setSelectedRegion('americas')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedRegion === 'americas'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                🗽 Americas
              </button>
              <button
                onClick={() => setSelectedRegion('asia-pacific')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedRegion === 'asia-pacific'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                🌏 Asia-Pacific
              </button>
              <button
                onClick={() => setSelectedRegion('africa')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedRegion === 'africa'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                🌍 Africa
              </button>
            </div>
          </div>

          {/* Disruption Panel */}
          <div>
            <DisruptionPanel disruptions={disruptions} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
