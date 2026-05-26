// metals.live API - Real-time commodity prices
// Free, no authentication required
// Rate limit: Unlimited for public data

export type MetalPrice = {
  symbol: string;
  name: string;
  currency: string;
  price: number;
  bid: number;
  ask: number;
  change: number; // Absolute change
  changePercent: number; // Percentage change
  timestamp: number;
};

// Map commodity names to metals.live symbols
const METAL_SYMBOLS: Record<string, string> = {
  copper: 'CU',
  gold: 'AU',
  silver: 'AG',
  nickel: 'NI',
  zinc: 'ZN',
  platinum: 'PT',
  palladium: 'PD',
  aluminum: 'AL',
  steel: 'SAUSD', // Steel index
};

export async function fetchMetalPrice(commodity: string): Promise<MetalPrice | null> {
  try {
    const symbol = METAL_SYMBOLS[commodity.toLowerCase()];
    if (!symbol) return null;

    // metals.live provides real-time prices via their API
    // Using public endpoint that doesn't require authentication
    const res = await fetch(
      `https://api.metals.live/v1/spot/price?currency=USD`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'MetalsAgent/1.0',
        },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    if (!data || typeof data !== 'object') return null;

    // metals.live returns prices in format: { "commodityName": { "bid": 123.45, "ask": 123.50, ... }, ... }
    const commodityKey = commodity.toLowerCase().replace(/ /g, '');
    const priceData = data[commodityKey];

    if (!priceData) return null;

    // Extract last known price from bid/ask
    const price = (priceData.bid + priceData.ask) / 2;
    const previousPrice = priceData.bid; // Simplified; real implementation would track history

    return {
      symbol: symbol,
      name: commodity.charAt(0).toUpperCase() + commodity.slice(1),
      currency: 'USD',
      price,
      bid: priceData.bid || price,
      ask: priceData.ask || price,
      change: price - previousPrice,
      changePercent: previousPrice > 0 ? ((price - previousPrice) / previousPrice) * 100 : 0,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(`Failed to fetch ${commodity} price:`, error);
    return null;
  }
}

export async function fetchAllMetalPrices(): Promise<MetalPrice[]> {
  const commodities = ['copper', 'gold', 'silver', 'nickel', 'zinc', 'platinum', 'palladium', 'aluminum'];

  try {
    const res = await fetch(
      `https://api.metals.live/v1/spot/price?currency=USD`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'MetalsAgent/1.0',
        },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    if (!data || typeof data !== 'object') return [];

    const prices: MetalPrice[] = [];

    for (const commodity of commodities) {
      const commodityKey = commodity.toLowerCase().replace(/ /g, '');
      const priceData = data[commodityKey];

      if (priceData) {
        const price = (priceData.bid + priceData.ask) / 2;
        prices.push({
          symbol: METAL_SYMBOLS[commodity],
          name: commodity.charAt(0).toUpperCase() + commodity.slice(1),
          currency: 'USD',
          price,
          bid: priceData.bid || price,
          ask: priceData.ask || price,
          change: 0, // Would need historical data to calculate
          changePercent: 0,
          timestamp: Date.now(),
        });
      }
    }

    return prices;
  } catch (error) {
    console.error('Failed to fetch metal prices:', error);
    return [];
  }
}
