import { NextResponse } from 'next/server';
import { getSentimentOnly } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/commodities/sentiment
 *
 * Returns sentiment data from NewsAPI (expensive, limited quota)
 * Called INFREQUENTLY (once per hour) from dashboard
 *
 * - Analyzes news headlines for bullish/bearish keywords
 * - Returns sentiment scores and article summaries
 * - Cached for 60 minutes to preserve NewsAPI quota
 *
 * Quota math:
 * - Free tier: 100-500 requests/day
 * - This endpoint: 3 NewsAPI calls per request
 * - At 1 call per hour: 3 calls × 24 = 72 calls/day (well within limits)
 *
 * Dashboard integration:
 * 1. Fetch /api/commodities/live every 30 seconds (prices only)
 * 2. Fetch /api/commodities/sentiment once per hour (sentiment only)
 * 3. Merge results in frontend before displaying
 */
export async function GET() {
  try {
    // Fetch sentiment from news (3 NewsAPI calls)
    const sentiment = await getSentimentOnly();

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        sentiment, // Map of commodity ID to sentiment data
        quotaUsage: {
          apiCallsMade: 3,
          estimatedDailyUsage: '72 calls/day at 1-hour polling',
          freeQuotaLimit: '100-500 calls/day',
          status: 'Well within limits ✅',
        },
        cacheInfo: {
          cachedFor: '60 minutes',
          nextRefreshAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        },
      },
      {
        headers: {
          'Cache-Control': 'max-age=3600', // Cache for 60 minutes
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch sentiment data:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sentiment data',
        timestamp: new Date().toISOString(),
        message: 'NewsAPI may be down. Returning neutral sentiment fallback.',
        sentiment: {
          copper: {
            sentiment: 'neutral',
            score: 0,
            mentionCount: 0,
            articles: [],
          },
          uranium: {
            sentiment: 'neutral',
            score: 0,
            mentionCount: 0,
            articles: [],
          },
          water: {
            sentiment: 'neutral',
            score: 0,
            mentionCount: 0,
            articles: [],
          },
        },
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'max-age=1800', // Cache error response for 30 min
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * POST /api/commodities/sentiment
 *
 * Manual refresh of sentiment data
 * Useful for testing or forcing an update
 */
export async function POST() {
  try {
    const sentiment = await getSentimentOnly();

    return NextResponse.json(
      {
        success: true,
        refreshed: true,
        timestamp: new Date().toISOString(),
        sentiment,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh sentiment data',
      },
      { status: 500 }
    );
  }
}
