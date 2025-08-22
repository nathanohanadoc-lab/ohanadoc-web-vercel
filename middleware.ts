import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Generate a per-request CSP nonce
  const nonce = crypto.randomUUID().replace(/-/g, '');
  res.headers.set('x-csp-nonce', nonce);
  // Compose CSP with nonce for inline scripts if any are used
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self' https:"
  ].join('; ');
  res.headers.set('Content-Security-Policy', csp);
  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};

