import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/search', '/quiz', '/bookmarks', '/leaderboard', '/daily-challenge', '/profile'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // agar cookie-based hai
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/search/:path*', '/quiz/:path*', '/bookmarks/:path*', '/leaderboard/:path*', '/daily-challenge/:path*', '/profile/:path*'],
};