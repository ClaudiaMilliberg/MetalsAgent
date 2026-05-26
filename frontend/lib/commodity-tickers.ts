// Commodity ETF & Ticker Database
// Maps commodities to their major exchange-traded vehicles

export type CommodityType = 'copper' | 'gold' | 'uranium' | 'silver' | 'nickel' | 'lithium' | 'cobalt' | 'palladium';

export interface Ticker {
  symbol: string;
  name: string;
  type: 'etf' | 'stock' | 'futures';
  sector: string;
  description: string;
  colorOffset: number; // 0-1 for slight color variation within commodity
}

export interface CommodityCluster {
  commodity: CommodityType;
  name: string;
  emoji: string;
  baseColor: {
    h: number; // Hue (0-360)
    s: number; // Saturation (0-100)
    l: number; // Lightness (0-100)
  };
  tickers: Ticker[];
}

export const COMMODITY_CLUSTERS: Record<CommodityType, CommodityCluster> = {
  copper: {
    commodity: 'copper',
    name: 'Copper',
    emoji: '🔴',
    baseColor: { h: 0, s: 100, l: 45 }, // Red
    tickers: [
      {
        symbol: 'COPX',
        name: 'Global X Copper Miners ETF',
        type: 'etf',
        sector: 'Mining',
        description: 'Pure-play copper mining exposure',
        colorOffset: 0,
      },
      {
        symbol: 'FCX',
        name: 'Freeport-McMoRan Inc.',
        type: 'stock',
        sector: 'Mining',
        description: 'World largest copper miner',
        colorOffset: 0.15,
      },
      {
        symbol: 'SCCO',
        name: 'Southern Copper',
        type: 'stock',
        sector: 'Mining',
        description: 'Major Latin American copper producer',
        colorOffset: 0.3,
      },
      {
        symbol: 'BHP',
        name: 'BHP Group',
        type: 'stock',
        sector: 'Mining',
        description: 'Diversified mining company',
        colorOffset: 0.45,
      },
      {
        symbol: 'GLDRX',
        name: 'Global X Copper Miners Index',
        type: 'etf',
        sector: 'Mining',
        description: 'Broad copper mining exposure',
        colorOffset: 0.6,
      },
    ],
  },

  uranium: {
    commodity: 'uranium',
    name: 'Uranium & Nuclear',
    emoji: '☢️',
    baseColor: { h: 120, s: 100, l: 45 }, // Green
    tickers: [
      {
        symbol: 'URA',
        name: 'Global X Uranium ETF',
        type: 'etf',
        sector: 'Energy',
        description: 'Diversified uranium producer exposure',
        colorOffset: 0,
      },
      {
        symbol: 'UUUU',
        name: 'Energy Fuels Inc.',
        type: 'stock',
        sector: 'Energy',
        description: 'US uranium and rare earth producer',
        colorOffset: 0.25,
      },
      {
        symbol: 'CCJ',
        name: 'Cameco Corporation',
        type: 'stock',
        sector: 'Energy',
        description: 'Canadian uranium leader',
        colorOffset: 0.5,
      },
      {
        symbol: 'DNN',
        name: 'Denison Mines',
        type: 'stock',
        sector: 'Energy',
        description: 'Mid-tier uranium producer',
        colorOffset: 0.75,
      },
    ],
  },

  gold: {
    commodity: 'gold',
    name: 'Gold',
    emoji: '🟨',
    baseColor: { h: 45, s: 100, l: 50 }, // Gold/Yellow
    tickers: [
      {
        symbol: 'GLD',
        name: 'SPDR Gold Shares',
        type: 'etf',
        sector: 'Precious Metals',
        description: 'Physical gold ETF',
        colorOffset: 0,
      },
      {
        symbol: 'GFI',
        name: 'Gold Fields Limited',
        type: 'stock',
        sector: 'Mining',
        description: 'Multi-region gold producer',
        colorOffset: 0.2,
      },
      {
        symbol: 'NEM',
        name: 'Newmont Goldcorp',
        type: 'stock',
        sector: 'Mining',
        description: 'World leading gold producer',
        colorOffset: 0.4,
      },
      {
        symbol: 'GDMK',
        name: 'Global X Gold Miners ETF',
        type: 'etf',
        sector: 'Mining',
        description: 'Gold mining companies',
        colorOffset: 0.6,
      },
    ],
  },

  silver: {
    commodity: 'silver',
    name: 'Silver',
    emoji: '⚪',
    baseColor: { h: 200, s: 30, l: 75 }, // Silver/Light Gray
    tickers: [
      {
        symbol: 'SLV',
        name: 'iShares Silver Trust',
        type: 'etf',
        sector: 'Precious Metals',
        description: 'Physical silver ETF',
        colorOffset: 0,
      },
      {
        symbol: 'PAAS',
        name: 'Pan American Silver',
        type: 'stock',
        sector: 'Mining',
        description: 'Primary and secondary silver producer',
        colorOffset: 0.33,
      },
      {
        symbol: 'MAG',
        name: 'Mag Silver Corp',
        type: 'stock',
        sector: 'Mining',
        description: 'Luxury primary silver producer',
        colorOffset: 0.66,
      },
    ],
  },

  nickel: {
    commodity: 'nickel',
    name: 'Nickel',
    emoji: '🔧',
    baseColor: { h: 280, s: 80, l: 45 }, // Purple
    tickers: [
      {
        symbol: 'LIHD',
        name: 'Global X Lithium & Battery Tech',
        type: 'etf',
        sector: 'Battery Materials',
        description: 'Battery materials including nickel',
        colorOffset: 0,
      },
      {
        symbol: 'GLO',
        name: 'Glencore plc',
        type: 'stock',
        sector: 'Mining',
        description: 'Diversified miner with nickel exposure',
        colorOffset: 0.33,
      },
      {
        symbol: 'TECK',
        name: 'Teck Resources',
        type: 'stock',
        sector: 'Mining',
        description: 'Major metals producer',
        colorOffset: 0.66,
      },
    ],
  },

  lithium: {
    commodity: 'lithium',
    name: 'Lithium',
    emoji: '🔋',
    baseColor: { h: 60, s: 80, l: 45 }, // Lime/Yellow-Green
    tickers: [
      {
        symbol: 'LIT',
        name: 'Global X Lithium ETF',
        type: 'etf',
        sector: 'Battery Materials',
        description: 'Pure-play lithium exposure',
        colorOffset: 0,
      },
      {
        symbol: 'ALB',
        name: 'Albemarle Corporation',
        type: 'stock',
        sector: 'Materials',
        description: 'Leading lithium producer',
        colorOffset: 0.25,
      },
      {
        symbol: 'SQM',
        name: 'Sociedad Química',
        type: 'stock',
        sector: 'Materials',
        description: 'Chilean lithium leader',
        colorOffset: 0.5,
      },
      {
        symbol: 'LAC',
        name: 'Lithium Americas',
        type: 'stock',
        sector: 'Mining',
        description: 'Development-stage lithium producer',
        colorOffset: 0.75,
      },
    ],
  },

  cobalt: {
    commodity: 'cobalt',
    name: 'Cobalt',
    emoji: '🔵',
    baseColor: { h: 240, s: 100, l: 45 }, // Blue
    tickers: [
      {
        symbol: 'LIHD',
        name: 'Global X Lithium & Battery Tech',
        type: 'etf',
        sector: 'Battery Materials',
        description: 'Battery materials including cobalt',
        colorOffset: 0,
      },
      {
        symbol: 'EME',
        name: 'Endeavour Mining',
        type: 'stock',
        sector: 'Mining',
        description: 'Gold and cobalt exposure',
        colorOffset: 0.5,
      },
    ],
  },

  palladium: {
    commodity: 'palladium',
    name: 'Palladium',
    emoji: '🟦',
    baseColor: { h: 220, s: 70, l: 50 }, // Steel Blue
    tickers: [
      {
        symbol: 'PALL',
        name: 'iShares Palladium Trust',
        type: 'etf',
        sector: 'Precious Metals',
        description: 'Physical palladium ETF',
        colorOffset: 0,
      },
      {
        symbol: 'RYA',
        name: 'Royal Palladium',
        type: 'etf',
        sector: 'Precious Metals',
        description: 'Palladium-focused exposure',
        colorOffset: 0.5,
      },
    ],
  },
};

/**
 * Get all commodities available
 */
export function getAllCommodities(): CommodityCluster[] {
  return Object.values(COMMODITY_CLUSTERS);
}

/**
 * Get tickers for a specific commodity
 */
export function getTickersForCommodity(commodity: CommodityType): Ticker[] {
  return COMMODITY_CLUSTERS[commodity]?.tickers || [];
}

/**
 * Generate HSL color for a ticker with slight variation
 */
export function getTickerColor(commodity: CommodityType, colorOffset: number): string {
  const cluster = COMMODITY_CLUSTERS[commodity];
  if (!cluster) return 'hsl(0, 0%, 50%)';

  const { h, s, l } = cluster.baseColor;
  // Apply slight hue variation based on colorOffset
  const hueShift = colorOffset * 20 - 10; // -10 to +10 hue shift
  const adjustedHue = (h + hueShift + 360) % 360;

  return `hsl(${adjustedHue}, ${s}%, ${l}%)`;
}

/**
 * Get cluster info for a commodity
 */
export function getCommodityCluster(commodity: CommodityType): CommodityCluster | undefined {
  return COMMODITY_CLUSTERS[commodity];
}

/**
 * Full ticker data with sentiment and signals
 */
export interface TickerDataFull {
  ticker: Ticker;
  commodity: CommodityType;
  price: number;
  change24h: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number;
  volatility: number;
  signals: {
    reddit: number;
    news: number;
    twitter: number;
    onchain: number;
  };
  headlines: string[];
  volume: number;
  marketCap?: number;
}
