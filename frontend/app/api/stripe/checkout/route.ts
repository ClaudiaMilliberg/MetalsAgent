import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export interface CheckoutRequest {
  tier: 'pro' | 'enterprise';
  user_id: string;
  email: string;
}

/**
 * Create Stripe checkout session
 * POST /api/stripe/checkout
 */
export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    // Validate request
    if (!body.tier || !body.user_id || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields: tier, user_id, email' },
        { status: 400 }
      );
    }

    if (!['pro', 'enterprise'].includes(body.tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be "pro" or "enterprise"' },
        { status: 400 }
      );
    }

    // Get Stripe price IDs from environment
    const priceId =
      body.tier === 'pro'
        ? process.env.STRIPE_PRO_PRICE_ID
        : process.env.STRIPE_ENTERPRISE_PRICE_ID;

    if (!priceId) {
      console.error(`Missing Stripe price ID for tier: ${body.tier}`);
      return NextResponse.json(
        { error: 'Pricing not configured' },
        { status: 500 }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: body.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        user_id: body.user_id,
        tier: body.tier,
      },
      // Auto-collect billing address
      billing_address_collection: 'required',
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        checkout_url: session.url,
        session_id: session.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Checkout creation failed',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
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
