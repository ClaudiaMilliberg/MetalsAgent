// Commodity ETF & Ticker Database
// Maps commodities to their major exchange-traded vehicles
// Premium design: distinct hues, high saturation, mid-range lightness

export type CommodityType = 'copper' | 'gold' | 'uranium' | 'silver' | 'nickel' | 'lithium' | 'aluminum' | 'zinc';

export interface Ticker {
  symbol: string;
  name: string;
  type: 'etf' | 'stock' | 'futures';
  sector: string;
  description: string;
  colorOffset: number; // 0-1 for slight color variation within commodity
  tier: 'tier1' | 'tier2' | 'tier3'; // Visual emphasis tier
}

export interface CommodityCluster {
  commodity: CommodityType;
  name: string;
  emoji: string;
  tier: 'tier1' | 'tier2' | 'tier3'; // Tier for emphasis
  baseColor: {
    h: number; // Hue (0-360)
    s: number; // Saturation (0-100)
    l: number; // Lightness (0-100)
  };
  rimLightColor?: string; // Optional rim-light override
  tickers: Ticker[];
}

export const COMMODITY_CLUSTERS: Record<CommodityType, CommodityCluster> = {
  // TIER 1: Strategic Majors
  copper: {
    commodity: 'copper',
    name: 'Copper',
    emoji: '🧱',
    tier: 'tier1',
    baseColor: { h: 18, s: 85, l: 48 }, // Warm Rust (HSL from design spec)
    rimLightColor: 'rgba(255, 120, 80, 0.4)',
    tickers: [
      {
        symbol: 'COPX',
        name: 'Global X Copper Miners ETF',
        type: 'etf',
        sector: 'Mining',
        description: 'Pure-play copper mining exposure',
        colorOffset: 0,
        tier: 'tier1',
      },
      {
        symbol: 'FCX',
        name: 'Freeport-McMoRan Inc.',
        type: 'stock',
        sector: 'Mining',
        description: 'World largest copper miner',
        colorOffset: 0.15,
        tier: 'tier1',
      },
      {
        symbol: 'SCCO',
        name: 'Southern Copper',
        type: 'stock',
        sector: 'Mining',
        description: 'Major Latin American copper producer',
        colorOffset: 0.3,
        tier: 'tier1',
      },
      {
        symbol: 'BHP',
        name: 'BHP Group',
        type: 'stock',
        sector: 'Mining',
        description: 'Diversified mining company',
        colorOffset: 0.45,
        tier: 'tier1',
      },
      {
        symbol: 'GLDRX',
        name: 'Global X Copper Miners Index',
        type: 'etf',
        sector: 'Mining',
        description: 'Broad copper mining exposure',
        colorOffset: 0.6,
        tier: 'tier1',
      },
    ],
  },

  gold: {
    commodity: 'gold',
    name: 'Gold',
    emoji: '💛',
    tier: 'tier1',
    baseColor: { h: 38, s: 90, l: 52 }, // Rich Amber
    rimLightColor: 'rgba(255, 200, 100, 0.4)',
    tickers: [
      {
        symbol: 'GLD',
        name: 'SPDR Gold Shares',
        type: 'etf',
        sector: 'Precious Metals',
        description: 'Physical gold ETF',
        colorOffset: 0,
        tier: 'tier1',
      },
      {
        symbol: 'GFI',
        name: 'Gold Fields Limited',
        type: 'stock',
        sector: 'Mining',
        description: 'Multi-region gold producer',
        colorOffset: 0.2,
        tier: 'tier1',
      },
      {
        symbol: 'NEM',
        name: 'Newmont Goldcorp',
        type: 'stock',
        sector: 'Mining',
        description: 'World leading gold producer',
        colorOffset: 0.4,
        tier: 'tier1',
      },
      {
        symbol: 'GDMK',
        name: 'Global X Gold Miners ETF',
        type: 'etf',
        sector: 'Mining',
        description: 'Gold mining companies',
        colorOffset: 0.6,
        tier: 'tier1',
      },
    ],
  },

  uranium: {
    commodity: 'uranium',
    name: 'Nuclear',
    emoji: '☢️',
    tier: 'tier1',
    baseColor: { h: 110, s: 80, l: 48 }, // Reactor Lime
    rimLightColor: 'rgba(150, 255, 100, 0.4)',
    tickers: [
      {
        symbol: 'URA',
        name: 'Global X Uranium ETF',
        type: 'etf',
        sector: 'Energy',
        description: 'Diversified uranium producer exposure',
        colorOffset: 0,
        tier: 'tier1',
      },
      {
        symbol: 'UUUU',
        name: 'Energy Fuels Inc.',
        type: 'stock',
        sector: 'Energy',
        description: 'US uranium and rare earth producer',
        colorOffset: 0.25,
        tier: 'tier1',
      },
      {
        symbol: 'CCJ',
        name: 'Cameco Corporation',
        type: 'stock',
        sector: 'Energy',
        description: 'Canadian uranium leader',
        colorOffset: 0.5,
        tier: 'tier1',
      },
      {
        symbol: 'DNN',
        name: 'Denison Mines',
        type: 'stock',
        sector: 'Energy',
        description: 'Mid-tier uranium producer',
        colorOffset: 0.75,
        tier: 'tier1',
      },
    ],
  },

  // TIER 2: Energy & Battery
  lithium: {
    commodity: 'lithium',
    name: 'Lithium',
    emoji: '🔋',
    tier: 'tier2',
    baseColor: { h: 270, s: 70, l: 52 }, // Twilight Violet
    rimLightColor: 'rgba(200, 150, 255, 0.4)',
    tickers: [
      {
        symbol: 'LIT',
        name: 'Global X Lithium ETF',
        type: 'etf',
        sector: 'Battery Materials',
        description: 'Pure-play lithium exposure',
        colorOffset: 0,
        tier: 'tier2',
      },
      {
        symbol: 'ALB',
        name: 'Albemarle Corporation',
        type: 'stock',
        sector: 'Materials',
        description: 'Leading lithium producer',
        colorOffset: 0.25,
        tier: 'tier2',
      },
      {
        symbol: 'SQM',
        name: 'Sociedad Química',
        type: 'stock',
        sector: 'Materials',
        description: 'Chilean lithium leader',
        colorOffset: 0.5,
        tier: 'tier2',
      },
      {
        symbol: 'LAC',
        name: 'Lithium Americas',
        type: 'stock',
        sector: 'Mining',
        description: 'Development-stage lithium producer',
        colorOffset: 0.75,
        tier: 'tier2',
      },
    ],
  },

  aluminum: {
    commodity: 'aluminum',
    name: 'Aluminum',
    emoji: '✈️',
    tier: 'tier2',
    baseColor: { h: 200, s: 50, l: 60 }, // Industrial Silver-Blue
    rimLightColor: 'rgba(150, 200, 255, 0.4)',
    tickers: [
      {
        symbol: 'AA',
        name: 'Alcoa Corporation',
        type: 'stock',
        sector: 'Mining',
        description: 'Largest US aluminum producer',
        colorOffset: 0,
        tier: 'tier2',
      },
      {
        symbol: 'CENOF',
        name: 'Century Aluminum',
        type: 'stock',
        sector: 'Mining',
        description: 'US-based aluminum producer',
        colorOffset: 0.33,
        tier: 'tier2',
      },
      {
        symbol: 'ALUMEN',
        name: 'Aluminum ETF',
        type: 'etf',
        sector: 'Materials',
        description: 'Diversified aluminum exposure',
        colorOffset: 0.66,
        tier: 'tier2',
      },
    ],
  },

  // TIER 3: Precious & Specialty
  silver: {
    commodity: 'silver',
    name: 'Silver',
    emoji: '⚪',
    tier: 'tier3',
    baseColor: { h: 210, s: 35, l: 68 }, // Moonlit Pewter
    rimLightColor: 'rgba(200, 220, 255, 0.3)',
    tickers: [
      {
        symbol: 'SLV',
        name: 'iShares Silver Trust',
        type: 'etf',
        sector: 'Precious Metals',
        description: 'Physical silver ETF',
        colorOffset: 0,
        tier: 'tier3',
      },
      {
        symbol: 'PAAS',
        name: 'Pan American Silver',
        type: 'stock',
        sector: 'Mining',
        description: 'Primary and secondary silver producer',
        colorOffset: 0.33,
        tier: 'tier3',
      },
      {
        symbol: 'MAG',
        name: 'Mag Silver Corp',
        type: 'stock',
        sector: 'Mining',
        description: 'Luxury primary silver producer',
        colorOffset: 0.66,
        tier: 'tier3',
      },
    ],
  },

  nickel: {
    commodity: 'nickel',
    name: 'Nickel',
    emoji: '🔧',
    tier: 'tier3',
    baseColor: { h: 190, s: 60, l: 48 }, // Ocean Teal
    rimLightColor: 'rgba(100, 200, 220, 0.4)',
    tickers: [
      {
        symbol: 'GLO',
        name: 'Glencore plc',
        type: 'stock',
        sector: 'Mining',
        description: 'Diversified miner with nickel exposure',
        colorOffset: 0,
        tier: 'tier3',
      },
      {
        symbol: 'TECK',
        name: 'Teck Resources',
        type: 'stock',
        sector: 'Mining',
        description: 'Major metals producer with nickel',
        colorOffset: 0.33,
        tier: 'tier3',
      },
      {
        symbol: 'NICK',
        name: 'Nickel Mining ETF',
        type: 'etf',
        sector: 'Mining',
        description: 'Diversified nickel producer exposure',
        colorOffset: 0.66,
        tier: 'tier3',
      },
    ],
  },

  zinc: {
    commodity: 'zinc',
    name: 'Zinc',
    emoji: '⚙️',
    tier: 'tier3',
    baseColor: { h: 240, s: 75, l: 45 }, // Deep Indigo
    rimLightColor: 'rgba(120, 150, 255, 0.4)',
    tickers: [
      {
        symbol: 'ZH',
        name: 'Zinc Producers ETF',
        type: 'etf',
        sector: 'Mining',
        description: 'Diversified zinc producer exposure',
        colorOffset: 0,
        tier: 'tier3',
      },
      {
        symbol: 'TECK',
        name: 'Teck Resources',
        type: 'stock',
        sector: 'Mining',
        description: 'Major zinc + copper producer',
        colorOffset: 0.33,
        tier: 'tier3',
      },
      {
        symbol: 'ANTM',
        name: 'Antam',
        type: 'stock',
        sector: 'Mining',
        description: 'Indonesian zinc and nickel miner',
        colorOffset: 0.66,
        tier: 'tier3',
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
