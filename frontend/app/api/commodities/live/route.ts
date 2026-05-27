import { NextResponse } from 'next/server';
import { getPricesOnly, getInfrastructureProjects } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/commodities/live
 *
 * Returns PRICES ONLY (no sentiment to preserve NewsAPI quota)
 * Called frequently (every 30 seconds) from dashboard
 *
 * - Copper, Gold: metals.live API (unlimited calls, real-time)
 * - Uranium: Market estimate (unlimited calls)
 * - Water: Infrastructure data (unlimited calls)
 * - Projects: 25+ infrastructure tracking
 *
 * NOTE: Sentiment is fetched separately via /api/commodities/sentiment
 * which caches for 60 minutes to stay within NewsAPI limits
 */
export async function GET() {
  try {
    // Fetch ONLY prices and projects (no sentiment)
    const [commodities, projects] = await Promise.all([
      getPricesOnly(),
      Promise.resolve(getInfrastructureProjects()),
    ]);

    // Compute aggregated metrics (based on prices only)
    const totalVolatility = commodities.reduce((acc, c) => acc + c.volatility, 0) / commodities.length;
    const avgPrice = commodities.reduce((acc, c) => acc + c.currentPrice, 0) / commodities.length;

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        commodities, // All have sentiment: 'neutral' until merged with /api/commodities/sentiment
        projects,
        metrics: {
          totalVolatility: parseFloat(totalVolatility.toFixed(2)),
          avgPrice: parseFloat(avgPrice.toFixed(2)),
          // Note: sentiment counts moved to /api/commodities/sentiment
        },
        dataQuality: {
          pricesSource: 'metals.live + market-estimate',
          pricesUpdateFrequency: 'real-time',
          sentimentSource: 'fetch from /api/commodities/sentiment (separate endpoint)',
          sentimentUpdateFrequency: 'once per hour (cached)',
          quotaUsage: 'This endpoint uses 0 NewsAPI calls per request',
        },
      },
      {
        headers: {
          'Cache-Control': 'max-age=30', // Cache prices for 30 seconds
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch commodity prices:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch commodity prices',
        timestamp: new Date().toISOString(),
        message: 'Check metals.live API availability',
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * POST /api/commodities/live
 *
 * Optional: Manual refresh for prices only (no sentiment)
 */
export async function POST() {
  try {
    const commodities = await getPricesOnly();

    return NextResponse.json(
      {
        success: true,
        refreshed: true,
        count: commodities.length,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh prices',
      },
      { status: 500 }
    );
  }
}
