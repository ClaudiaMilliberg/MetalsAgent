import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { SignalIngestRequest, SignalIngestResponse } from '@/lib/types';
import { signalRateLimiter, getClientIp, verifySignature } from '@/lib/security';

// POST /api/signals/ingest
// Webhook endpoint for metals agent to post signals
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request.headers);
    if (!signalRateLimiter.isAllowed(clientIp)) {
      const remaining = signalRateLimiter.getRemainingRequests(clientIp);
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          remaining_requests: remaining,
        },
        { status: 429 }
      );
    }

    const rawBody = await request.text();
    let body: SignalIngestRequest;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON', code: 'PARSE_ERROR' },
        { status: 400 }
      );
    }

    // Optional: Verify webhook signature if secret is provided
    const signatureHeader = request.headers.get('x-signal-signature');
    if (process.env.SIGNAL_WEBHOOK_SECRET && signatureHeader) {
      try {
        const isValid = verifySignature(
          rawBody,
          signatureHeader,
          process.env.SIGNAL_WEBHOOK_SECRET
        );
        if (!isValid) {
          return NextResponse.json(
            { success: false, error: 'Invalid signature', code: 'SIGNATURE_ERROR' },
            { status: 401 }
          );
        }
      } catch (error) {
        console.error('Signature verification error:', error);
        return NextResponse.json(
          { success: false, error: 'Signature verification failed', code: 'SIGNATURE_ERROR' },
          { status: 401 }
        );
      }
    }

    // Validate required fields
    if (!body.sentiment || !body.confidence || body.edge_pct === undefined || !body.commodity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate sentiment value
    if (!['bullish', 'bearish', 'neutral'].includes(body.sentiment)) {
      return NextResponse.json(
        { success: false, error: 'Invalid sentiment value', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate confidence is between 0 and 1
    if (body.confidence < 0 || body.confidence > 1) {
      return NextResponse.json(
        { success: false, error: 'Confidence must be between 0 and 1', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate commodity exists
    const { data: commodity, error: commodityError } = await supabaseAdmin
      .from('commodities')
      .select('id')
      .eq('id', body.commodity.toLowerCase())
      .single();

    if (commodityError || !commodity) {
      return NextResponse.json(
        { success: false, error: `Invalid commodity: ${body.commodity}`, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Insert signal into database
    const { data, error } = await supabaseAdmin.from('signals').insert({
      commodity_id: body.commodity.toLowerCase(),
      sentiment: body.sentiment,
      confidence: body.confidence,
      edge_pct: body.edge_pct,
      timestamp: body.timestamp || new Date().toISOString(),
      source: body.source || 'unknown',
      metadata: body.metadata || null,
    }).select('id').single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Database error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }

    const response: SignalIngestResponse = {
      success: true,
      signal_id: data.id,
      stored_at: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in signal ingest:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

// CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
