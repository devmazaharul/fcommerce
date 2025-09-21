import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './utils';

export async function middleware(req: NextRequest) {
  const tokenCookie = req.cookies.get('token')?.value;

  // Logged in user trying to access /access -> redirect to /admin
  if (req.nextUrl.pathname === '/access' && tokenCookie) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Admin routes require a token
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!tokenCookie || !tokenCookie.startsWith('Bearer ')) {
      return NextResponse.redirect(new URL('/access', req.url));
    }

    const token = tokenCookie.split(' ')[1];
    const isValid =await verifyToken(token);

    if (!isValid) {
      return NextResponse.redirect(new URL('/access', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/access'],
};
