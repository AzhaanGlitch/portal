import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for route protection.
 * Runs before every matched request.
 */
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  // --- Auth restricted paths (login/register, etc.) ---
  const isAuthRestrictedPath =
    pathname.startsWith('/auth') ||
    pathname.startsWith('/auth/verify-otp')

  // --- Redirect logic ---
  if (accessToken) {
    // Authenticated but accessing login/register → redirect home
    if (isAuthRestrictedPath) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } else {
    // Not authenticated → redirect everything (matched routes) to /auth
    const loginUrl = new URL('/auth', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Continue request if no conditions matched
  return NextResponse.next()
}

/**
 * Config matcher:
 * - Middleware runs on everything except:
 *   - api routes
 *   - _next internals
 *   - favicon/static assets
 *   - your defined public paths
 */
export const config = {
  matcher: [
    // Protect all except explicitly public paths
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|$|pages/home|pages/about|pages/contact|auth|pages/services).*)',
    '/profile/:path*',
  ],
}
