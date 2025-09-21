import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './utils';

export function middleware(req: NextRequest) {
  let token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/access', req.url));
  }
  if (!token.startsWith("Bearer")) {
    return NextResponse.redirect(new URL('/access', req.url));
  }
  token = token.split(' ')[1];
  if (!verifyToken(token))
    return NextResponse.redirect(new URL('/access', req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
