'use client';

import { useState } from 'react';

interface Mine {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  operator: string;
  output: number;
  status: 'producing' | 'ramping' | 'development' | 'blocked';
  riskLevel: 'low' | 'medium' | 'high';
}

const MINES: Mine[] = [
  {
    id: 'escondida',
    name: 'Escondida',
    country: 'Chile',
    lat: -23.7,
    lng: -68.1,
    operator: 'BHP',
    output: 1200000,
    status: 'producing',
    riskLevel: 'low',
  },
  {
    id: 'collahuasi',
    name: 'Collahuasi',
    country: 'Chile',
    lat: -20.9,
    lng: -68.6,
    operator: 'Glencore/Anglo',
    output: 600000,
    status: 'producing',
    riskLevel: 'low',
  },
  {
    id: 'cerro-verde',
    name: 'Cerro Verde',
    country: 'Peru',
    lat: -16.5,
    lng: -71.5,
    operator: 'Freeport',
    output: 500000,
    status: 'producing',
    riskLevel: 'medium',
  },
  {
    id: 'morenci',
    name: 'Morenci',
    country: 'USA - Arizona',
    lat: 33.1,
    lng: -109.3,
    operator: 'Freeport',
    output: 450000,
    status: 'producing',
    riskLevel: 'low',
  },
  {
    id: 'grasberg',
    name: 'Grasberg',
    country: 'Indonesia',
    lat: -4.05,
    lng: 137.1,
    operator: 'Freeport',
    output: 400000,
    status: 'producing',
    riskLevel: 'high',
  },
  {
    id: 'kamoa-kakula',
    name: 'Kamoa-Kakula',
    country: 'DRC',
    lat: -10.7,
    lng: 25.5,
    operator: 'Ivanhoe',
    output: 400000,
    status: 'ramping',
    riskLevel: 'high',
  },
  {
    id: 'antamina',
    name: 'Antamina',
    country: 'Peru',
    lat: -9.5,
    lng: -77.0,
    operator: 'BHP/Glencore',
    output: 380000,
    status: 'producing',
    riskLevel: 'medium',
  },
  {
    id: 'los-bronces',
    name: 'Los Bronces',
    country: 'Chile',
    lat: -33.5,
    lng: -70.4,
    operator: 'Anglo American',
    output: 350000,
    status: 'producing',
    riskLevel: 'low',
  },
  {
    id: 'chuquicamata',
    name: 'Chuquicamata',
    country: 'Chile',
    lat: -22.3,
    lng: -68.9,
    operator: 'Codelco',
    output: 330000,
    status: 'producing',
    riskLevel: 'low',
  },
  {
    id: 'buenavista',
    name: 'Buenavista',
    country: 'Mexico',
    lat: 30.7,
    lng: -110.9,
    operator: 'Grupo Mexico',
    output: 300000,
    status: 'producing',
    riskLevel: 'medium',
  },
  {
    id: 'olympic-dam',
    name: 'Olympic Dam',
    country: 'Australia',
    lat: -30.4,
    lng: 136.9,
    operator: 'BHP',
    output: 200000,
    status: 'producing',
    riskLevel: 'low',
  },
  {
    id: 'resolution',
    name: 'Resolution',
    country: 'USA - Arizona',
    lat: 33.3,
    lng: -111.1,
    operator: 'Rio Tinto/BHP',
    output: 0,
    status: 'development',
    riskLevel: 'low',
  },
  {
    id: 'pebble',
    name: 'Pebble',
    country: 'USA - Alaska',
    lat: 59.9,
    lng: -155.0,
    operator: 'Northern Dynasty',
    output: 0,
    status: 'blocked',
    riskLevel: 'low',
  },
  {
    id: 'reko-diq',
    name: 'Reko Diq',
    country: 'Pakistan',
    lat: 28.9,
    lng: 62.4,
    operator: 'Barrick',
    output: 0,
    status: 'development',
    riskLevel: 'medium',
  },
];

interface Props {
  selectedRegion: string | null;
}

export default function MineMap({ selectedRegion }: Props) {
  const [selectedMine, setSelectedMine] = useState<Mine | null>(null);

  const getStatusColor = (status: string, riskLevel: string) => {
    if (status === 'producing' && riskLevel === 'low') return '#22c55e'; // Green
    if (status === 'producing' && riskLevel === 'medium') return '#eab308'; // Yellow
    if (status === 'producing' && riskLevel === 'high') return '#ef4444'; // Red
    if (status === 'ramping') return '#eab308'; // Yellow
    if (status === 'development') return '#3b82f6'; // Blue
    if (status === 'blocked') return '#6b7280'; // Gray
    return '#64748b';
  };

  const filteredMines = MINES.filter((mine) => {
    if (!selectedRegion) return true;
    if (selectedRegion === 'americas') return ['Chile', 'Peru', 'USA - Arizona', 'USA - Alaska', 'Mexico'].includes(mine.country);
    if (selectedRegion === 'asia-pacific') return ['Indonesia', 'Australia'].includes(mine.country);
    if (selectedRegion === 'africa') return ['DRC'].includes(mine.country);
    return true;
  });

  return (
    <div className="w-full h-full flex gap-4 p-4">
      {/* SVG Map Visualization */}
      <div className="flex-1 bg-slate-900 rounded overflow-auto">
        <svg viewBox="0 0 1000 600" className="w-full h-full">
          {/* Background */}
          <rect width="1000" height="600" fill="#0a0e1a" />

          {/* Grid */}
          <g stroke="#334155" strokeWidth="1" opacity="0.2">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 125} y1="0" x2={i * 125} y2="600" />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 150} x2="1000" y2={i * 150} />
            ))}
          </g>

          {/* Mines */}
          {filteredMines.map((mine) => {
            const x = ((mine.lng + 180) / 360) * 1000;
            const y = ((90 - mine.lat) / 180) * 600;

            return (
              <g
                key={mine.id}
                onClick={() => setSelectedMine(mine)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow effect for high risk */}
                {mine.riskLevel === 'high' && (
                  <circle
                    cx={x}
                    cy={y}
                    r="25"
                    fill={getStatusColor(mine.status, mine.riskLevel)}
                    opacity="0.2"
                  />
                )}

                {/* Mine marker */}
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill={getStatusColor(mine.status, mine.riskLevel)}
                  stroke={selectedMine?.id === mine.id ? '#fff' : 'none'}
                  strokeWidth="2"
                />

                {/* Pulse animation for high risk */}
                {mine.riskLevel === 'high' && (
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="none"
                    stroke={getStatusColor(mine.status, mine.riskLevel)}
                    strokeWidth="1"
                    opacity="0.5"
                    style={{
                      animation: 'pulse 2s infinite',
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Pulse animation */}
          <style>{`
            @keyframes pulse {
              0%, 100% { r: 12; opacity: 0.5; }
              50% { r: 20; opacity: 0; }
            }
          `}</style>
        </svg>
      </div>

      {/* Mine Details */}
      <div className="w-64">
        {selectedMine ? (
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 h-full overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-3">{selectedMine.name}</h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400">Country</p>
                <p className="text-white font-semibold">{selectedMine.country}</p>
              </div>

              <div>
                <p className="text-slate-400">Operator</p>
                <p className="text-white font-semibold">{selectedMine.operator}</p>
              </div>

              <div>
                <p className="text-slate-400">Status</p>
                <p className={`font-semibold capitalize ${
                  selectedMine.status === 'producing' ? 'text-emerald-400' :
                  selectedMine.status === 'ramping' ? 'text-yellow-400' :
                  selectedMine.status === 'blocked' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {selectedMine.status}
                </p>
              </div>

              {selectedMine.output > 0 && (
                <div>
                  <p className="text-slate-400">Annual Output</p>
                  <p className="text-white font-semibold">
                    {(selectedMine.output / 1000000).toFixed(2)}M tonnes/yr
                  </p>
                </div>
              )}

              {selectedMine.riskLevel !== 'low' && (
                <div>
                  <p className="text-slate-400">Risk Level</p>
                  <p className={`font-semibold capitalize ${
                    selectedMine.riskLevel === 'high' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {selectedMine.riskLevel}
                  </p>
                </div>
              )}

              {selectedMine.output > 0 && (
                <div>
                  <p className="text-slate-400">Price Impact if Disrupted</p>
                  <p className="text-white font-semibold">
                    +{((selectedMine.output / 21000000) * 2.5 * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 h-full flex items-center justify-center">
            <p className="text-slate-400 text-center">👆 Click a mine for details</p>
          </div>
        )}
      </div>
    </div>
  );
}
