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
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">⛏️ Mining Operations</h1>
            <button
              onClick={() => {
                setLoading(true);
                fetch('/api/mines/disruptions')
                  .then((res) => res.json())
                  .then((data) => {
                    setDisruptions(data.disruptions);
                    setLoading(false);
                  })
                  .catch(() => {
                    setLoading(false);
                  });
              }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-premium text-white hover:glass-premium-strong transition-all duration-300 font-semibold text-sm"
              title="Manually refresh disruption data"
            >
              ⟲ Refresh
            </button>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Real-time supply chain tracking and disruption analysis • Auto-updates every 10 minutes
          </p>
        </div>

        {/* Supply at Risk Card */}
        <div className={`mb-8 rounded-2xl border p-6 sm:p-8 shadow-2xl transition-all duration-300 ${
          totalDisruptionPercent > 15
            ? 'glass-premium-strong border-red-500/40 bg-gradient-to-br from-red-950/30 to-red-950/10'
            : 'glass-premium-strong border-green-500/40 bg-gradient-to-br from-green-950/20 to-green-950/5'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Supply at Risk</p>
              <div className="flex items-baseline gap-3">
                <p className="text-5xl sm:text-6xl lg:text-7xl font-black text-white">
                  {totalDisruptionPercent.toFixed(1)}%
                </p>
                <span className={`text-sm font-semibold ${totalDisruptionPercent > 15 ? 'text-red-400' : 'text-green-400'}`}>
                  {totalDisruptionPercent > 15 ? 'Critical' : 'Stable'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-4 font-semibold flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${totalDisruptionPercent > 15 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                {disruptions.length} active disruption{disruptions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className={`text-5xl sm:text-6xl lg:text-7xl flex-shrink-0 ${totalDisruptionPercent > 15 ? 'animate-pulse' : ''}`}>
              {totalDisruptionPercent > 15 ? '🚨' : '✅'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          {/* Map */}
          <div className="lg:col-span-3 order-1 lg:order-1">
            <div className="glass-premium-strong rounded-2xl overflow-hidden h-80 sm:h-96 shadow-2xl transition-shadow duration-300">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-950/50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500/30 border-t-emerald-500 mx-auto mb-3"></div>
                    <p className="text-gray-400 font-semibold text-sm">Loading map...</p>
                  </div>
                </div>
              ) : (
                <MineMap selectedRegion={selectedRegion} />
              )}
            </div>

            {/* Region Buttons */}
            <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setSelectedRegion(null)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition duration-300 ease-premium border ${
                  selectedRegion === null
                    ? 'bg-emerald-600/70 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700/50'
                }`}
              >
                🌍 Global
              </button>
              <button
                onClick={() => setSelectedRegion('americas')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition duration-300 ease-premium border ${
                  selectedRegion === 'americas'
                    ? 'bg-emerald-600/70 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700/50'
                }`}
              >
                🗽 Americas
              </button>
              <button
                onClick={() => setSelectedRegion('asia-pacific')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition duration-300 ease-premium border ${
                  selectedRegion === 'asia-pacific'
                    ? 'bg-emerald-600/70 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700/50'
                }`}
              >
                🌏 Asia-Pacific
              </button>
              <button
                onClick={() => setSelectedRegion('africa')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition duration-300 ease-premium border ${
                  selectedRegion === 'africa'
                    ? 'bg-emerald-600/70 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700/50'
                }`}
              >
                🌍 Africa
              </button>
            </div>
          </div>

          {/* Disruption Panel */}
          <div className="order-2 lg:order-2">
            <DisruptionPanel disruptions={disruptions} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
