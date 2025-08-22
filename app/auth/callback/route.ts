import { NextRequest, NextResponse } from 'next/server';

// Minimal callback route to terminate PKCE/OIDC in the app layer if needed.
export async function GET(req: NextRequest) {
  // In a full implementation, validate state/code and exchange for tokens via API
  // Here we simply redirect to dashboard and let the API/session handle validation
  const url = new URL(req.url);
  const fragments = url.hash;
  const dest = new URL('/admin', url.origin);
  if (fragments) dest.hash = fragments;
  return NextResponse.redirect(dest.toString());
}

