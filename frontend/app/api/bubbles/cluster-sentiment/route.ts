import { NextResponse } from 'next/server';
import { fetchRedditCommodityPosts, findCommodityMentions } from '@/lib/reddit';
import { fetchCommodityNews } from '@/lib/gdelt';
import { fetchMetalPrice } from '@/lib/metals-live';
import { COMMODITY_CLUSTERS, CommodityType } from '@/lib/commodity-tickers';

interface TickerData {
  ticker: {
    symbol: string;
    name: string;
    type: string;
    sector: string;
    description: string;
    colorOffset: number;
  };
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

/**
 * Filter headlines to English only using simple heuristics
 */
function filterEnglishHeadlines(headlines: string[]): string[] {
  return headlines.filter((headline) => {
    // Simple English detection: mostly ASCII characters
    const asciiCount = (headline.match(/[A-Za-z0-9\s\-':.,&()!?]/g) || []).length;
    const totalChars = headline.length;

    // Accept if >80% ASCII or no obvious non-English characters
    if (asciiCount / totalChars > 0.8) return true;

    // Reject if contains obvious non-English patterns
    if (headline.match(/[一-鿿]/)) return false; // Chinese
    if (headline.match(/[ぁ-ん]/)) return false; // Hiragana
    if (headline.match(/[ァ-ヴー]/)) return false; // Katakana
    if (headline.match(/[가-힣]/)) return false; // Korean
    if (headline.match(/[א-ת]/)) return false; // Hebrew
    if (headline.match(/[ء-ي]/)) return false; // Arabic

    return true;
  });
}

/**
 * Generate mock sentiment data for a ticker based on commodity sentiment
 */
function generateTickerSentiment(
  commodity: CommodityType,
  commoditySentiment: number,
  noiseAmount: number = 0.15
) {
  // Add some noise to commodity sentiment to vary across tickers
  const noise = (Math.random() - 0.5) * 2 * noiseAmount;
  const score = Math.max(0, Math.min(100, commoditySentiment + noise * 30));

  const sentiment: 'bullish' | 'bearish' | 'neutral' =
    score > 55 ? 'bullish' : score < 45 ? 'bearish' : 'neutral';

  return { sentiment, score };
}

/**
 * Mock price data for tickers (in production, would fetch from real APIs)
 */
const TICKER_PRICES: Record<string, { price: number; change24h: number; volume: number; marketCap?: number }> = {
  // Copper
  COPX: { price: 185.42, change24h: 2.35, volume: 8500000, marketCap: 24000000000 },
  FCX: { price: 42.88, change24h: 1.92, volume: 52000000, marketCap: 63000000000 },
  SCCO: { price: 38.12, change24h: 0.88, volume: 4200000, marketCap: 32000000000 },
  BHP: { price: 62.45, change24h: 1.45, volume: 12800000, marketCap: 185000000000 },
  GLDRX: { price: 24.92, change24h: 1.88, volume: 1900000, marketCap: 8500000000 },

  // Uranium
  URA: { price: 32.15, change24h: 3.42, volume: 5600000, marketCap: 1800000000 },
  UUUU: { price: 7.45, change24h: 4.12, volume: 28400000, marketCap: 2100000000 },
  CCJ: { price: 34.88, change24h: 2.75, volume: 4200000, marketCap: 10500000000 },
  DNN: { price: 2.12, change24h: 3.65, volume: 89000000, marketCap: 950000000 },

  // Gold
  GLD: { price: 198.34, change24h: 0.45, volume: 8900000, marketCap: 96000000000 },
  GFI: { price: 13.42, change24h: 0.92, volume: 12500000, marketCap: 6200000000 },
  NEM: { price: 48.92, change24h: -0.35, volume: 8200000, marketCap: 38500000000 },
  GDMK: { price: 18.65, change24h: 0.68, volume: 2100000, marketCap: 3200000000 },

  // Silver
  SLV: { price: 32.18, change24h: 1.12, volume: 45600000, marketCap: 9200000000 },
  PAAS: { price: 25.42, change24h: 2.34, volume: 5200000, marketCap: 5800000000 },
  MAG: { price: 18.88, change24h: 1.98, volume: 3200000, marketCap: 2100000000 },

  // Nickel
  LIHD: { price: 52.45, change24h: 1.82, volume: 2800000, marketCap: 1200000000 },
  GLO: { price: 14.92, change24h: 0.75, volume: 8900000, marketCap: 45000000000 },
  TECK: { price: 24.18, change24h: 1.45, volume: 5600000, marketCap: 18200000000 },

  // Lithium
  LIT: { price: 78.92, change24h: 2.45, volume: 9800000, marketCap: 12500000000 },
  ALB: { price: 98.45, change24h: 3.12, volume: 6200000, marketCap: 21500000000 },
  SQM: { price: 72.18, change24h: 2.88, volume: 2100000, marketCap: 34200000000 },
  LAC: { price: 18.34, change24h: 4.92, volume: 8500000, marketCap: 4200000000 },

  // Cobalt
  EME: { price: 32.12, change24h: 1.65, volume: 3200000, marketCap: 8900000000 },

  // Palladium
  PALL: { price: 156.42, change24h: -1.22, volume: 1200000, marketCap: 2100000000 },
  RYA: { price: 142.88, change24h: -0.95, volume: 980000, marketCap: 1850000000 },
};

export async function GET() {
  try {
    // Fetch real sentiment data from Reddit and GDELT
    const commodityList = Object.keys(COMMODITY_CLUSTERS) as CommodityType[];

    const [redditPosts, newsEvents] = await Promise.all([
      fetchRedditCommodityPosts().catch(() => []),
      Promise.all(commodityList.map((c) => fetchCommodityNews(c)))
        .then((results) => results.flat())
        .catch(() => []),
    ]);

    // Find commodity mentions
    const redditMentions = findCommodityMentions(redditPosts, commodityList);

    // Build sentiment scores per commodity
    const commoditySentiments: Record<CommodityType, { score: number; headlines: string[] }> = {} as any;

    for (const name of commodityList) {
      const redditData = redditMentions.find((m) => m.commodity.toLowerCase() === name);
      const newsData = newsEvents.filter((e) => e.title.toLowerCase().includes(name));

      // Calculate sentiment
      const redditScore = redditData ? (redditData.mentions / 10) * 100 : 0;
      const newsScore = newsData.length > 0
        ? newsData.reduce((sum, e) => sum + (e.sentiment || 0), 0) / (newsData.length || 1) * 10
        : 0;
      const avgScore = (redditScore + newsScore) / 2;

      // Collect headlines
      const headlines = newsData.slice(0, 5).map((e) => e.title);
      const englishHeadlines = filterEnglishHeadlines(headlines);

      commoditySentiments[name as CommodityType] = {
        score: Math.max(0, Math.min(100, avgScore + 50)),
        headlines: englishHeadlines,
      };
    }

    // Build ticker data
    const tickers: TickerData[] = [];

    for (const [commodityName, cluster] of Object.entries(COMMODITY_CLUSTERS)) {
      const commodity = commodityName as CommodityType;
      const commoditySentiment = commoditySentiments[commodity]?.score || 50;
      const commodityHeadlines = commoditySentiments[commodity]?.headlines || [];

      for (const ticker of cluster.tickers) {
        const priceData = TICKER_PRICES[ticker.symbol] || {
          price: Math.random() * 200 + 10,
          change24h: (Math.random() - 0.5) * 5,
          volume: Math.random() * 50000000,
        };

        const { sentiment, score } = generateTickerSentiment(commodity, commoditySentiment);

        // Fetch real price if available
        let realPrice = priceData.price;
        if (commodity === 'copper' || commodity === 'gold') {
          try {
            const metalPrice = await fetchMetalPrice(commodity);
            if (metalPrice) realPrice = metalPrice.price;
          } catch (e) {
            // Fallback to mock price
          }
        }

        tickers.push({
          ticker,
          commodity,
          price: realPrice,
          change24h: priceData.change24h,
          sentiment,
          sentimentScore: score,
          volatility: 5 + Math.random() * 20,
          signals: {
            reddit: 20 + Math.random() * 30,
            news: 20 + Math.random() * 30,
            twitter: 15 + Math.random() * 25,
            onchain: 10 + Math.random() * 20,
          },
          headlines: filterEnglishHeadlines([
            ...commodityHeadlines,
            ...redditPosts.slice(0, 2).map((p) => p.title),
          ]),
          volume: priceData.volume || Math.random() * 50000000,
          marketCap: priceData.marketCap,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        tickers,
        commodities: Object.keys(COMMODITY_CLUSTERS).length,
        totalTickers: tickers.length,
      },
      {
        headers: {
          'Cache-Control': 'max-age=300', // 5 minute cache
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch cluster sentiment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cluster sentiment data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
