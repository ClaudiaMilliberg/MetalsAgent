'use client';

import { useState } from 'react';

interface Disruption {
  id: string;
  location: string;
  type: string;
  affectedOutput: number;
  priceImpact: number;
  severity: 'critical' | 'moderate' | 'minor';
  daysAgo: number;
}

interface Supply {
  id: string;
  project: string;
  location: string;
  startDate: number;
  endDate: number;
  annualOutput: number;
  priceImpact: number;
  status: 'completed' | 'ramping' | 'planned';
}

interface Props {
  disruptions: Disruption[];
  loading: boolean;
}

export default function DisruptionPanel({ disruptions, loading }: Props) {
  const [activeTab, setActiveTab] = useState<'disruptions' | 'supply' | 'futures'>('disruptions');

  // Mock supply additions data
  const supplyAdditions: Supply[] = [
    {
      id: '1',
      project: 'Kamoa-Kakula Expansion',
      location: 'DRC',
      startDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
      endDate: Date.now() + 300 * 24 * 60 * 60 * 1000,
      annualOutput: 400000,
      priceImpact: -3.5,
      status: 'ramping',
    },
    {
      id: '2',
      project: 'Reko Diq Development',
      location: 'Pakistan',
      startDate: Date.now() + 730 * 24 * 60 * 60 * 1000,
      endDate: Date.now() + 1095 * 24 * 60 * 60 * 1000,
      annualOutput: 300000,
      priceImpact: -2.8,
      status: 'planned',
    },
    {
      id: '3',
      project: 'Resolution Mine',
      location: 'Arizona, USA',
      startDate: Date.now() + 1460 * 24 * 60 * 60 * 1000,
      endDate: Date.now() + 1825 * 24 * 60 * 60 * 1000,
      annualOutput: 350000,
      priceImpact: -2.1,
      status: 'planned',
    },
  ];

  // Mock futures timeline
  const futuresTimeline = [
    {
      months: 0,
      forecast: 'Current: Tight supply, risks elevated',
      priceTarget: 4.65,
    },
    {
      months: 3,
      forecast: 'Q2: Kamoa ramps, supply eases slightly',
      priceTarget: 4.42,
    },
    {
      months: 6,
      forecast: 'H2: Seasonal demand decline expected',
      priceTarget: 4.18,
    },
    {
      months: 12,
      forecast: '2027: Major supply additions online',
      priceTarget: 3.95,
    },
    {
      months: 24,
      forecast: '2028: EV demand ramp offsets supply',
      priceTarget: 4.35,
    },
  ];

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-900/20 border-red-500/50 text-red-200';
      case 'moderate':
        return 'bg-amber-900/20 border-amber-500/50 text-amber-200';
      case 'minor':
        return 'bg-yellow-900/20 border-yellow-500/50 text-yellow-200';
      default:
        return 'bg-slate-700/30 border-slate-600/50 text-slate-300';
    }
  };

  const severityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '🚨';
      case 'moderate':
        return '⚠️';
      case 'minor':
        return '⚡';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 h-96 overflow-y-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-slate-600">
        <button
          onClick={() => setActiveTab('disruptions')}
          className={`px-3 py-2 text-sm font-semibold transition ${
            activeTab === 'disruptions'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          🚨 Disruptions
        </button>
        <button
          onClick={() => setActiveTab('supply')}
          className={`px-3 py-2 text-sm font-semibold transition ${
            activeTab === 'supply'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          ⬆️ Supply Add
        </button>
        <button
          onClick={() => setActiveTab('futures')}
          className={`px-3 py-2 text-sm font-semibold transition ${
            activeTab === 'futures'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          📈 Futures
        </button>
      </div>

      {/* Content */}
      {activeTab === 'disruptions' && (
        <>
          <h2 className="text-lg font-bold text-white mb-4">Active Disruptions</h2>
          {loading ? (
            <p className="text-slate-400 text-center py-6">Loading...</p>
          ) : disruptions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-slate-400">No active disruptions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {disruptions.map((d) => (
                <div key={d.id} className={`rounded border p-2 text-xs ${severityColor(d.severity)}`}>
                  <div className="flex items-start gap-2">
                    <span>{severityIcon(d.severity)}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{d.location}</p>
                      <p className="opacity-80">{d.type}</p>
                      <p>Supply: {d.affectedOutput.toFixed(1)}% | Impact: +{d.priceImpact.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'supply' && (
        <>
          <h2 className="text-lg font-bold text-white mb-4">Supply Additions (Price Impact)</h2>
          <div className="space-y-3 text-xs">
            {supplyAdditions.map((s) => {
              const monthsUntil = Math.ceil((s.startDate - Date.now()) / (30 * 24 * 60 * 60 * 1000));
              return (
                <div key={s.id} className="bg-slate-700/30 border border-slate-600/50 rounded p-2">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white">{s.project}</p>
                      <p className="text-slate-400">{s.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      s.status === 'ramping' ? 'bg-yellow-900/50 text-yellow-200' :
                      s.status === 'planned' ? 'bg-blue-900/50 text-blue-200' :
                      'bg-emerald-900/50 text-emerald-200'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p>Output: <span className="text-emerald-400 font-semibold">{(s.annualOutput / 1000000).toFixed(2)}M tonnes/yr</span></p>
                    <p>Price Impact: <span className="text-red-400 font-semibold">{s.priceImpact.toFixed(1)}%</span></p>
                    <p className="text-slate-400">Starts in {monthsUntil} months</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'futures' && (
        <>
          <h2 className="text-lg font-bold text-white mb-4">Price Futures Timeline</h2>
          <div className="space-y-2 text-xs">
            {futuresTimeline.map((f, i) => (
              <div key={i} className="bg-slate-700/30 border border-slate-600/50 rounded p-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-300">{f.months === 0 ? 'Now' : `+${f.months}mo`}</p>
                    <p className="text-slate-400 text-xs mt-1">{f.forecast}</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-semibold text-white">${f.priceTarget.toFixed(2)}</p>
                    <p className={`text-xs ${f.priceTarget < 4.65 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {f.priceTarget < 4.65 ? '↓' : '↑'} {Math.abs(f.priceTarget - 4.65).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t border-slate-600">
        <p className="text-xs text-slate-400 mb-2">RISK SUMMARY</p>
        <div className="space-y-1 text-xs">
          <p className="flex justify-between"><span className="text-slate-300">Immediate (0-3mo):</span> <span className="text-amber-400">Medium</span></p>
          <p className="flex justify-between"><span className="text-slate-300">Medium-term (3-12mo):</span> <span className="text-emerald-400">Easing</span></p>
          <p className="flex justify-between"><span className="text-slate-300">Long-term (2yr+):</span> <span className="text-blue-400">Stabilizing</span></p>
        </div>
      </div>
    </div>
  );
}
