'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CommodityType, getAllCommodities, getTickersForCommodity, getCommodityCluster, type TickerDataFull } from '@/lib/commodity-tickers';

const ClusterBubbleVisualization = dynamic(
  () => import('../components/ClusterBubbleVisualization'),
  { ssr: false }
);
const TickerDetailCard = dynamic(
  () => import('../components/TickerDetailCard'),
  { ssr: false }
);
export default function BubblesClustersPage() {
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityType>('copper');
  const [selectedTicker, setSelectedTicker] = useState<TickerDataFull | null>(null);
  const [tickerData, setTickerData] = useState<TickerDataFull[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cluster data
  useEffect(() => {
    const fetchClusterData = async () => {
      try {
        const res = await fetch('/api/bubbles/cluster-sentiment');
        const data = await res.json();

        if (data.tickers) {
          setTickerData(data.tickers);
        }
      } catch (error) {
        console.error('Failed to fetch cluster data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClusterData();
  }, []);

  const commodities = getAllCommodities();
  const currentCluster = getCommodityCluster(selectedCommodity);
  const tickersInCluster = getTickersForCommodity(selectedCommodity);
  const clusterTickerData = tickerData.filter(
    (t) => t.commodity === selectedCommodity
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🫧 Commodity Market Clusters
          </h1>
          <p className="text-slate-400">
            ETF & stock analysis grouped by commodity, with real-time sentiment
          </p>
        </div>

        {/* Commodity Selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {commodities.map((cluster) => (
            <button
              key={cluster.commodity}
              onClick={() => {
                setSelectedCommodity(cluster.commodity);
                setSelectedTicker(null);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCommodity === cluster.commodity
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {cluster.emoji} {cluster.name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-slate-300">Loading cluster data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bubble Visualization */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 h-96">
                <ClusterBubbleVisualization
                  tickers={clusterTickerData}
                  commodity={selectedCommodity}
                  selectedTicker={selectedTicker}
                  onSelectTicker={setSelectedTicker}
                />
              </div>

              {/* Ticker List */}
              <div className="mt-4 bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                <h3 className="text-lg font-bold text-white mb-3">
                  Tickers in {currentCluster?.name}
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {clusterTickerData.map((data) => (
                    <div
                      key={data.ticker.symbol}
                      onClick={() => setSelectedTicker(data)}
                      className={`p-3 rounded cursor-pointer transition-all ${
                        selectedTicker?.ticker.symbol === data.ticker.symbol
                          ? 'bg-emerald-600/30 border border-emerald-500'
                          : 'bg-slate-700/30 border border-slate-600/50 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-white">
                            {data.ticker.symbol}
                          </p>
                          <p className="text-xs text-slate-400">
                            {data.ticker.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">
                            ${data.price.toFixed(2)}
                          </p>
                          <p
                            className={`text-xs ${
                              data.change24h >= 0
                                ? 'text-emerald-400'
                                : 'text-red-400'
                            }`}
                          >
                            {data.change24h >= 0 ? '+' : ''}
                            {data.change24h.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detail Card */}
            <div>
              {selectedTicker ? (
                <TickerDetailCard ticker={selectedTicker} />
              ) : (
                <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-slate-400 mb-2">👆</p>
                    <p className="text-slate-400">
                      Click a bubble to see details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/30 rounded p-4 border border-slate-700/50">
            <p className="font-semibold text-slate-300 mb-2">💡 How it works</p>
            <p className="text-sm text-slate-400">
              Each bubble represents a ticker within the {currentCluster?.name}{' '}
              cluster. Size shows volatility, color shows sentiment strength.
            </p>
          </div>
          <div className="bg-slate-800/30 rounded p-4 border border-slate-700/50">
            <p className="font-semibold text-slate-300 mb-2">📊 Data Sources</p>
            <p className="text-sm text-slate-400">
              Combines Reddit sentiment, news analysis, and real price data to
              give you confidence in each position.
            </p>
          </div>
          <div className="bg-slate-800/30 rounded p-4 border border-slate-700/50">
            <p className="font-semibold text-slate-300 mb-2">🎯 Quick Stats</p>
            <p className="text-sm text-slate-400">
              {clusterTickerData.length} tickers tracked in{' '}
              {currentCluster?.name} cluster
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
