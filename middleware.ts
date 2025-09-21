import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
    "/dashboard/user(.*)",
    "/dashboard/client(.*)"
]);

const isAdminRoute = createRouteMatcher(['/dashboard/client(.*)'])


export default clerkMiddleware(async (auth, req) => {
    const session = await auth();
    // Use the pathname for route matching
    const pathname = req.nextUrl?.pathname || new URL(req.url).pathname;

    // Debug logging to help diagnose redirect issues
    console.debug('[middleware] pathname=', pathname, 'userId=', session?.userId);

    if (!session?.userId && isProtectedRoute(req)) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}