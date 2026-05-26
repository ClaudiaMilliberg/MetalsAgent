import { NextResponse } from 'next/server';

// Mock sentiment data - in production, aggregate from Reddit + News + GDELT
const getMockSentiment = () => {
  const commodities = [
    'copper',
    'gold',
    'nickel',
    'zinc',
    'silver',
    'platinum',
    'palladium',
    'aluminum',
    'steel',
  ];

  return commodities.map((name) => ({
    id: name,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    price: Math.random() * 5000 + 100,
    change24h: (Math.random() - 0.5) * 10,
    sentiment: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)] as any,
    score: Math.random() * 100,
    volatility: Math.random() * 20,
    glow: ['orange', 'blue', 'white', 'purple'][Math.floor(Math.random() * 4)] as any,
    signalBreakdown: {
      reddit: Math.random() * 40,
      news: Math.random() * 40,
      twitter: Math.random() * 40,
      onchain: Math.random() * 40,
    },
    headlines: [
      `${name} prices surge amid global demand`,
      `Supply chain disruptions affect ${name} market`,
      `New mining project to increase ${name} supply`,
    ],
    demand: Math.random() > 0.5 ? 'EV transition driving demand +12%' : 'Industrial demand stable',
    confidence: Math.random() * 100,
    lastUpdated: new Date().toISOString(),
  }));
};

export async function GET() {
  try {
    // In production:
    // 1. Fetch Reddit data: https://www.reddit.com/r/investing+commodities+infrastructure+supplychain+energy.json?limit=100
    // 2. Fetch News from NewsAPI (already configured)
    // 3. Fetch GDELT: https://api.gdeltproject.org/api/v2/doc/doc?query=[commodity]&mode=artlist&format=json
    // 4. Aggregate sentiment scores

    const commodities = getMockSentiment();

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        commodities,
        sourcesCovered: ['reddit', 'news', 'gdelt'],
      },
      {
        headers: {
          'Cache-Control': 'max-age=1800', // Cache for 30 minutes
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch sentiment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sentiment data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
