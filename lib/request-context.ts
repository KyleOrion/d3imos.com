/**
 * Feelix Brothers Request Context Utilities
 *
 * Educational: Extract metadata from HTTP requests for audit logging
 */

/**
 * Get client IP address from request
 *
 * Educational: IP detection order in serverless/proxy environments:
 * 1. x-forwarded-for - Set by proxies (Vercel, Cloudflare, nginx)
 * 2. x-real-ip - Alternative proxy header
 * 3. Fallback to 'unknown' (serverless doesn't have socket.remoteAddress)
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for format: "client, proxy1, proxy2"
    // We want the first IP (the real client)
    return forwarded.split(',')[0].trim();
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

/**
 * Get user agent from request
 */
export function getUserAgent(req: Request): string | undefined {
  return req.headers.get('user-agent') || undefined;
}

/**
 * Get request context for audit logging
 */
export function getRequestContext(req: Request) {
  return {
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req),
  };
}
