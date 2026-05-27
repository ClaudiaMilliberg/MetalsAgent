import { NextResponse } from 'next/server';
import { fetchFuturesTimeline } from '@/lib/yahoo-finance';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commodity = searchParams.get('commodity') || 'copper';
    const granularity = (searchParams.get('granularity') as any) || 'monthly';

    const timeline = await fetchFuturesTimeline(commodity, granularity);

    return NextResponse.json(
      {
        success: true,
        commodity,
        granularity,
        timeline,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'max-age=1800', // 30 minutes
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch futures timeline:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch futures timeline',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
