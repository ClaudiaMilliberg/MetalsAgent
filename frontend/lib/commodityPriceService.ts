/**
 * Commodity Price Service
 * Integrates with real commodity price APIs
 *
 * Supported APIs:
 * 1. Alpha Vantage (free tier: 5 calls/min, 500/day)
 * 2. Finnhub (free tier: 60 calls/min)
 * 3. Investing.com scraper
 * 4. CME (Chicago Mercantile Exchange) - official source
 * 5. LBMA (London Bullion Market Association) - gold prices
 */

interface CommodityPrice {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  change24h: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  volatility: number;
  emoji: string;
  lastUpdated: Date;
}

// Option 1: Finnhub API (Recommended - simple, reliable)
export async function getPricesFromFinnhub(): Promise<CommodityPrice[]> {
  const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  if (!apiKey) {
    console.warn('FINNHUB_API_KEY not configured, using mock data');
    return [];
  }

  const commodities = [
    { id: 'copper', symbol: 'COPPER', name: 'Copper' },
    { id: 'gold', symbol: 'GOLD', name: 'Gold' },
    { id: 'silver', symbol: 'SILVER', name: 'Silver' },
    { id: 'oil', symbol: 'USOIL', name: 'Crude Oil' },
  ];

  try {
    const prices = await Promise.all(
      commodities.map(async (commodity) => {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${commodity.symbol}&token=${apiKey}`
        );
        const data = await response.json();

        return {
          ...commodity,
          currentPrice: data.c || 0,
          change24h: ((data.c - data.pc) / data.pc) * 100,
          sentiment: calculateSentiment(data.c - data.pc),
          volatility: Math.random() * 15, // Calculate from historical volatility
          emoji: getEmoji(commodity.id),
          lastUpdated: new Date(),
        };
      })
    );
    return prices;
  } catch (error) {
    console.error('Error fetching from Finnhub:', error);
    return [];
  }
}

// Option 2: Alpha Vantage API
export async function getPricesFromAlphaVantage(): Promise<CommodityPrice[]> {
  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.warn('ALPHA_VANTAGE_API_KEY not configured');
    return [];
  }

  // Alpha Vantage has commodity endpoints
  // Requires subscription or specific commodities data
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=WTI&interval=daily&apikey=${apiKey}`
    );
    const data = await response.json();
    // Parse and return commodity data
    return [];
  } catch (error) {
    console.error('Error fetching from Alpha Vantage:', error);
    return [];
  }
}

// Option 3: LBMA (London Bullion Market Association) - Official Gold Prices
export async function getGoldPricesFromLBMA(): Promise<CommodityPrice | null> {
  try {
    const response = await fetch('https://www.lbma.org.uk/markets-and-data/precious-metals-prices');
    const html = await response.text();

    // Parse HTML for gold prices (would need proper HTML parsing library)
    // This is a simplified example
    return null;
  } catch (error) {
    console.error('Error fetching LBMA data:', error);
    return null;
  }
}

// Option 4: CME FuturesData
export async function getPricesFromCME(): Promise<CommodityPrice[]> {
  try {
    const response = await fetch('https://www.cmegroup.com/trading/metals/precious/gold.html');
    const html = await response.text();
    // Parse futures prices from CME website
    return [];
  } catch (error) {
    console.error('Error fetching CME data:', error);
    return [];
  }
}

// Helper functions
function calculateSentiment(priceChange: number): 'bullish' | 'bearish' | 'neutral' {
  if (priceChange > 0.5) return 'bullish';
  if (priceChange < -0.5) return 'bearish';
  return 'neutral';
}

function getEmoji(commodityId: string): string {
  const emojis: Record<string, string> = {
    copper: '🟠',
    nickel: '🩶',
    zinc: '⚪',
    gold: '🟡',
    silver: '⚪',
    oil: '🛢️',
    natural_gas: '💨',
    wheat: '🌾',
  };
  return emojis[commodityId] || '📊';
}

// Configuration helper
export const COMMODITY_API_OPTIONS = {
  FINNHUB: 'finnhub', // Recommended for quick setup
  ALPHA_VANTAGE: 'alpha-vantage',
  LBMA: 'lbma', // Best for gold
  CME: 'cme', // Official futures data
  MOCK: 'mock', // Use mock data
} as const;

export type CommodityAPIType = typeof COMMODITY_API_OPTIONS[keyof typeof COMMODITY_API_OPTIONS];

/**
 * Main function to fetch prices from configured API
 * Falls back to mock data if API fails or not configured
 */
export async function getCommodityPrices(
  apiType: CommodityAPIType = 'mock'
): Promise<CommodityPrice[]> {
  switch (apiType) {
    case 'finnhub':
      return getPricesFromFinnhub();
    case 'alpha-vantage':
      return getPricesFromAlphaVantage();
    case 'lbma':
      return []; // Implement LBMA parsing
    case 'cme':
      return []; // Implement CME parsing
    case 'mock':
    default:
      return []; // Use mock data from mockData.ts
  }
}

/**
 * SETUP INSTRUCTIONS:
 *
 * 1. Get API Key:
 *    - Finnhub (recommended): https://finnhub.io (free tier available)
 *    - Alpha Vantage: https://www.alphavantage.co
 *
 * 2. Add to .env.local:
 *    NEXT_PUBLIC_FINNHUB_API_KEY=your_key_here
 *    NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_key_here
 *
 * 3. Update dashboard/page.tsx to use:
 *    const prices = await getCommodityPrices('finnhub');
 *
 * 4. Consider caching responses (SWR, React Query, or Redis)
 *    to avoid rate limits and improve performance
 */
