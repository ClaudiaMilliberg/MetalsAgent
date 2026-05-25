import crypto from 'crypto';

/**
 * Simple in-memory rate limiter
 * Tracks requests by IP and enforces limit
 * WARNING: Resets on app restart. Use Redis for production.
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number = 100, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs; // 1 minute default
  }

  isAllowed(ip: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(ip) || [];

    // Remove old timestamps outside the window
    const recentRequests = timestamps.filter(ts => now - ts < this.windowMs);

    if (recentRequests.length >= this.limit) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(ip, recentRequests);
    return true;
  }

  getRemainingRequests(ip: string): number {
    const now = Date.now();
    const timestamps = this.requests.get(ip) || [];
    const recentRequests = timestamps.filter(ts => now - ts < this.windowMs);
    return Math.max(0, this.limit - recentRequests.length);
  }
}

export const signalRateLimiter = new RateLimiter(100, 60000); // 100 req/min
export const checkoutRateLimiter = new RateLimiter(10, 60000); // 10 req/min

/**
 * Verify webhook signature using HMAC-SHA256
 * Prevents spoofed signals from being accepted
 */
export function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

/**
 * Extract client IP from request headers
 * Works with proxies (Vercel, Cloudflare, etc.)
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return headers.get('x-real-ip') || 'unknown';
}
