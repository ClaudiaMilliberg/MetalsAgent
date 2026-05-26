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
  // Fallback mock disruption data
  const mockDisruptions: Disruption[] = [
    {
      id: '1',
      location: 'Zambia - Nkana Region',
      type: 'Power Outage',
      affectedOutput: 8.5,
      priceImpact: 2.3,
      severity: 'critical',
      daysAgo: 2,
    },
    {
      id: '2',
      location: 'Peru - Antapaccay',
      type: 'Strike',
      affectedOutput: 5.2,
      priceImpact: 1.8,
      severity: 'moderate',
      daysAgo: 5,
    },
    {
      id: '3',
      location: 'Chile - Escondida',
      type: 'Maintenance',
      affectedOutput: 2.1,
      priceImpact: 0.6,
      severity: 'minor',
      daysAgo: 1,
    },
  ];

  const [disruptions, setDisruptions] = useState<Disruption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisruptions = async () => {
      try {
        const res = await fetch('/api/mines/disruptions');
        const data = await res.json();
        setDisruptions(data.disruptions || mockDisruptions);
      } catch (error) {
        console.warn('Using fallback disruption data:', error);
        setDisruptions(mockDisruptions);
      } finally {
        setLoading(false);
      }
    };

    fetchDisruptions();
    const interval = setInterval(fetchDisruptions, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const totalDisruptionPercent = disruptions.reduce((sum, d) => sum + d.affectedOutput, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030810] via-[#0a0e1f] to-[#0f0820] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">⛏️ Mining Operations</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Real-time supply chain tracking and disruption analysis
          </p>
        </div>

        {/* Supply at Risk Card */}
        <div className={`mb-8 rounded-2xl border p-8 ${
          totalDisruptionPercent > 15
            ? 'glass-premium-strong border-red-500/40 bg-red-950/20'
            : 'glass-premium-strong border-green-500/40 bg-green-950/10'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Supply at Risk</p>
              <p className="text-5xl sm:text-6xl font-black text-white">
                {totalDisruptionPercent.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400 mt-3 font-semibold">{disruptions.length} active disruptions</p>
            </div>
            <div className="text-6xl sm:text-7xl">{totalDisruptionPercent > 15 ? '🚨' : '✅'}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          {/* Map */}
          <div className="lg:col-span-3">
            <div className="glass-premium-strong rounded-2xl overflow-hidden h-96">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400 font-semibold">Loading map...</p>
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
