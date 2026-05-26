'use client';

interface Disruption {
  id: string;
  location: string;
  type: string;
  affectedOutput: number;
  priceImpact: number;
  severity: 'critical' | 'moderate' | 'minor';
  daysAgo: number;
}

interface Props {
  disruptions: Disruption[];
  loading: boolean;
}

export default function DisruptionPanel({ disruptions, loading }: Props) {
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
      <h2 className="text-lg font-bold text-white mb-4">Active Disruptions</h2>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-slate-400">Loading disruptions...</p>
        </div>
      ) : disruptions.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-slate-400">No active disruptions</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {disruptions.map((disruption) => (
            <div
              key={disruption.id}
              className={`rounded-lg border p-3 ${severityColor(disruption.severity)}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">
                  {severityIcon(disruption.severity)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{disruption.location}</p>
                  <p className="text-xs opacity-80 truncate">{disruption.type}</p>
                  <div className="mt-2 space-y-1 text-xs">
                    <p>Supply affected: {disruption.affectedOutput.toFixed(1)}%</p>
                    <p>Price impact: +{disruption.priceImpact.toFixed(1)}%</p>
                    <p>Active: {disruption.daysAgo}d ago</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-slate-600">
        <p className="text-xs text-slate-400 mb-2">SUPPLY CHAIN RISK</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">Critical</span>
            <span className="text-red-400 font-semibold">
              {disruptions.filter((d) => d.severity === 'critical').length}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">Moderate</span>
            <span className="text-amber-400 font-semibold">
              {disruptions.filter((d) => d.severity === 'moderate').length}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">Minor</span>
            <span className="text-yellow-400 font-semibold">
              {disruptions.filter((d) => d.severity === 'minor').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
