import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedPrefixes = ['/member', '/cart', '/checkout'];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;

  if (accessToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/auth/login', request.url);
  loginUrl.searchParams.set('next', `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/member/:path*', '/cart/:path*', '/checkout/:path*'],
};
