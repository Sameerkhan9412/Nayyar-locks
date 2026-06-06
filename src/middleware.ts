import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Redirect to login page
      const loginUrl = new URL('/login', request.url);
      // Pass the original path as redirect parameter if needed
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect to dashboard if logged in and trying to access login page
  if (pathname === '/login') {
    if (token) {
      const dashboardUrl = new URL('/admin', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
