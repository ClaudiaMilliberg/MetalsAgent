import { NextResponse } from 'next/server';
import { fetchAllMetalPrices } from '@/lib/metals-live';
import { fetchFuturesPrice } from '@/lib/yahoo-finance';

export const dynamic = 'force-dynamic';

// Commodity prices from metals.live
const getPrices = async () => {
  try {
    const spotPrices = await fetchAllMetalPrices();

    // Get futures prices for key commodities
    const commodities = ['copper', 'gold', 'nickel', 'zinc', 'silver'];
    const futuresPrices = await Promise.all(
      commodities.map((c) => fetchFuturesPrice(c))
    );

    return {
      spotPrices,
      futuresPrices: futuresPrices.filter((p) => p !== null),
    };
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    return {
      spotPrices: [],
      futuresPrices: [],
    };
  }
};

export async function GET() {
  try {
    const priceData = await getPrices();

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        ...priceData,
      },
      {
        headers: {
          'Cache-Control': 'max-age=300', // 5 minutes for price data
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch commodity prices:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch price data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
