import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * This middleware function runs before a request is completed.
 * It's used here to protect routes by checking for an authentication cookie.
 *
 * @param {NextRequest} request The incoming request object.
 * @returns {NextResponse} A response object to continue, redirect, or rewrite the request.
 */
export function middleware(request: NextRequest) {
    // 1. Get the access token cookie from the request
    const accessToken = request.cookies.get('access_token')?.value;
    const { pathname } = request.nextUrl;

    // 2. Define public paths that do not require authentication
    // These are accessible even without an access token.
    // We use `startsWith` to catch nested routes like /auth/register
    const isPublicPath =
        pathname.startsWith('/auth') ||
        pathname === '/' || // the homepage is public
        pathname.startsWith('/_next/') || // Next.js internal paths
        pathname.startsWith('/api/') || // Assuming some API routes might be public
        pathname.includes('.'); // Exclude static files like favicon.ico

    // 3. Define paths that a logged-in user should NOT be able to access
    // For example, if a user is logged in, they shouldn't see the login page.
    const isAuthRestrictedPath = pathname.startsWith('/auth') || pathname.startsWith('/auth/verfiy-otp');

    // --- REDIRECTION LOGIC ---

    // If the user is authenticated (has a token)...
    if (accessToken) {
        // and they try to access the login/register page, redirect them to the home.
        if (isAuthRestrictedPath) {
            console.log('Middleware: Authenticated user accessing auth page. Redirecting to /.');
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    // If the user is not authenticated...
    else {
        // and they are trying to access a protected page (i.e., not a public path),
        // redirect them to the login page.
        if (!isPublicPath) {
            console.log(`Middleware: Unauthenticated user accessing protected path: ${pathname}. Redirecting to /auth/login.`);
            // Store the originally requested URL to redirect back after login
            const loginUrl = new URL('/auth', request.url);
            loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // 4. If none of the above conditions are met, allow the request to proceed.
    return NextResponse.next();
}

/**
 * The matcher configures the middleware to run only on specific paths.
 * This is more efficient than running it on every single request.
 *
 * It avoids running on static assets and internal Next.js paths.
 * Match all request paths except for the ones starting with:
 * - api (API routes - handled separately or have their own auth checks)
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 */
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        '/profile/:path*'
    ],
};