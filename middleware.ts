import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const url = req.nextUrl.clone();

    if (url.pathname === '/access' && token) {
        url.pathname = '/admin';
        return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith('/admin')) {
        if (!token) {
            url.pathname = '/access';
            return NextResponse.redirect(url);
        }

        try {
            // const isValid = await verifyToken(token);
            const isValid = true;
            if (!isValid) {
                url.pathname = '/access';
                return NextResponse.redirect(url);
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            url.pathname = '/access';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/access'],
};
