import { NextResponse } from 'next/server';

// Mock disruption data - in production, query GDELT for recent copper mine disruptions
const getMockDisruptions = () => {
  const allDisruptions = [
    {
      id: '1',
      location: 'Peru - Antamina',
      type: 'Labor Dispute',
      affectedOutput: 3.8,
      priceImpact: 9.5,
      severity: 'moderate' as const,
      daysAgo: Math.floor(Math.random() * 30),
    },
    {
      id: '2',
      location: 'DRC - Kamoa-Kakula',
      type: 'Political Instability',
      affectedOutput: 4.0,
      priceImpact: 10.0,
      severity: 'critical' as const,
      daysAgo: Math.floor(Math.random() * 30),
    },
    {
      id: '3',
      location: 'Indonesia - Grasberg',
      type: 'Environmental Concerns',
      affectedOutput: 4.0,
      priceImpact: 10.0,
      severity: 'high' as const,
      daysAgo: Math.floor(Math.random() * 30),
    },
    {
      id: '4',
      location: 'Mexico - Buenavista',
      type: 'Weather Impact',
      affectedOutput: 3.0,
      priceImpact: 7.5,
      severity: 'minor' as const,
      daysAgo: Math.floor(Math.random() * 30),
    },
  ];

  // Only return disruptions from the last 7 days with probability
  return allDisruptions.filter(() => Math.random() > 0.5);
};

export async function GET() {
  try {
    // In production:
    // Query GDELT: https://api.gdeltproject.org/api/v2/doc/doc?query=copper%20mine%20strike%20OR%20flood%20OR%20shutdown
    // Parse results to extract mine name, type of disruption, and impact

    const disruptions = getMockDisruptions();

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        disruptions,
        totalAffected: disruptions.reduce((sum, d) => sum + d.affectedOutput, 0),
      },
      {
        headers: {
          'Cache-Control': 'max-age=600', // Cache for 10 minutes
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch disruptions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch disruption data',
        timestamp: new Date().toISOString(),
        disruptions: [],
      },
      { status: 500 }
    );
  }
}
