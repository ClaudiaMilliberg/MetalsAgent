'use client';

import { useEffect, useState } from 'react';

export interface CommodityData {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  change24h: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  volatility: number;
  emoji: string;
  lastUpdated: Date;
  source: string;
}

export interface InfrastructureProject {
  id: string;
  name: string;
  type: 'mining' | 'dam' | 'desalination' | 'irrigation' | 'reactor';
  location: string;
  country: string;
  status: 'planning' | 'construction' | 'operation';
  completionDate: Date;
  investmentBillion: number;
  impactOnPrice: number;
  commodityAffected: string[];
}

interface SentimentData {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  mentionCount: number;
  articles: Array<{
    title: string;
    source: string;
    url: string;
  }>;
}

interface SentimentResponse {
  [key: string]: SentimentData | undefined;
  copper?: SentimentData;
  uranium?: SentimentData;
  water?: SentimentData;
}

interface CommoditiesState {
  commodities: CommodityData[];
  projects: InfrastructureProject[];
  sentiment: SentimentResponse;
  loading: boolean;
  error: string | null;
  lastPriceUpdate: Date | null;
  lastSentimentUpdate: Date | null;
}

/**
 * Custom hook for fetching and merging commodity data
 *
 * Fetches prices frequently (30s) and sentiment infrequently (60min)
 * to optimize NewsAPI quota usage
 */
export function useCommodities() {
  const [state, setState] = useState<CommoditiesState>({
    commodities: [],
    projects: [],
    sentiment: {},
    loading: true,
    error: null,
    lastPriceUpdate: null,
    lastSentimentUpdate: null,
  });

  // ============= FETCH PRICES (Every 30 seconds) =============
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/commodities/live');
        const data = await res.json();

        if (data.success) {
          setState((prev) => ({
            ...prev,
            commodities: data.commodities,
            projects: data.projects,
            lastPriceUpdate: new Date(),
            error: null,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            error: data.message || 'Failed to fetch prices',
          }));
        }
      } catch (error) {
        console.error('Failed to fetch prices:', error);
        setState((prev) => ({
          ...prev,
          error: 'Failed to fetch commodity prices',
        }));
      }
    };

    // Fetch immediately
    fetchPrices();

    // Then fetch every 30 seconds
    const priceInterval = setInterval(fetchPrices, 30 * 1000);

    return () => clearInterval(priceInterval);
  }, []);

  // ============= FETCH SENTIMENT (Once per hour) =============
  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const res = await fetch('/api/commodities/sentiment');
        const data = await res.json();

        if (data.success) {
          setState((prev) => ({
            ...prev,
            sentiment: data.sentiment || {},
            lastSentimentUpdate: new Date(),
            loading: false,
          }));
        } else {
          console.warn('Failed to fetch sentiment:', data.message);
          setState((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch sentiment:', error);
        setState((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };

    // Fetch immediately
    fetchSentiment();

    // Then fetch every 60 minutes
    const sentimentInterval = setInterval(fetchSentiment, 60 * 60 * 1000);

    return () => clearInterval(sentimentInterval);
  }, []);

  // ============= MERGE PRICES + SENTIMENT =============
  const mergedCommodities = state.commodities.map((commodity) => ({
    ...commodity,
    sentiment:
      state.sentiment[commodity.id.toLowerCase()]?.sentiment || commodity.sentiment,
  }));

  return {
    commodities: mergedCommodities,
    projects: state.projects,
    sentiment: state.sentiment,
    loading: state.loading,
    error: state.error,
    lastPriceUpdate: state.lastPriceUpdate,
    lastSentimentUpdate: state.lastSentimentUpdate,
  };
}
