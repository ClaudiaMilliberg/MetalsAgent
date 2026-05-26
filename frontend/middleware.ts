import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Public routes — always allow
  const publicRoutes = ['/', '/api/stripe/checkout', '/api/webhooks/stripe', '/api/health'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return res;
  }

  // Not logged in — redirect to landing
  if (!session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Check subscription for dashboard routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/bubbles') || pathname.startsWith('/mines')) {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, tier, current_period_end')
      .eq('user_id', session.user.id)
      .single();

    const isActive =
      subscription?.status === 'active' &&
      new Date(subscription.current_period_end) > new Date();

    if (!isActive) {
      // No active subscription — send back to landing with message
      return NextResponse.redirect(new URL('/?upgrade=true', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
};
