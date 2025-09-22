
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './utils'; // ধরে নিচ্ছি verifyToken একটি async ফাংশন

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const url = req.nextUrl.clone();

  // যদি ইউজার /access পেজে থাকে এবং তার কাছে টোকেন থাকে, তাকে /admin এ রিডাইরেক্ট করুন।
  if (url.pathname === '/access' && token) {
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  // যদি ইউজার /admin রুটে অ্যাক্সেস করতে চায়
  if (url.pathname.startsWith('/admin')) {
    // যদি কোনো টোকেন না থাকে, তাকে /access পেজে পাঠিয়ে দিন।
    if (!token) {
      url.pathname = '/access';
      return NextResponse.redirect(url);
    }

    // টোকেন আছে, এখন এর বৈধতা যাচাই করুন।
    try {
      const isValid = await verifyToken(token);
      if (!isValid) {
        // টোকেন বৈধ না হলে, তাকে /access পেজে রিডাইরেক্ট করুন।
        url.pathname = '/access';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // টোকেন যাচাইয়ের সময় কোনো এরর হলে, তাকে /access এ পাঠিয়ে দিন।
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