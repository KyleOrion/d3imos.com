// Simple in-memory rate limiter for learning purposes
// Educational: In production, use Redis-based rate limiting (Upstash, Vercel KV, etc.)

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Store rate limit data in memory
// Educational: This will reset when server restarts and doesn't work across multiple servers
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number;

  /**
   * Time window in seconds
   */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Rate limit a request by identifier (typically IP address)
 *
 * Educational: How rate limiting works:
 * 1. Each identifier (IP) gets a "bucket" with maxRequests tokens
 * 2. Each request consumes 1 token
 * 3. When bucket is empty, requests are rejected
 * 4. Bucket refills after windowSeconds
 *
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Result indicating if request is allowed
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  // Get or create entry for this identifier
  let entry = rateLimitStore.get(identifier);

  // If no entry or window expired, create new entry
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(identifier, entry);
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count and allow request
  entry.count++;

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get the client's IP address from a Next.js request
 *
 * Educational: IP detection order:
 * 1. x-forwarded-for - Set by proxies (Vercel, Cloudflare, etc.)
 * 2. x-real-ip - Alternative proxy header
 * 3. req.socket.remoteAddress - Direct connection IP
 *
 * @param req - Next.js request object
 * @returns IP address or 'unknown'
 */
export function getClientIp(req: Request): string {
  // Check for forwarded IP (from Vercel, Cloudflare, etc.)
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
    // We want the first one (the real client)
    return forwarded.split(',')[0].trim();
  }

  // Check for real IP header
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback (won't work in serverless)
  return 'unknown';
}
