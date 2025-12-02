import { NextResponse } from 'next/server';

// Lightweight Edge middleware: check session and enforce role-based redirects.
// Uses the user-role cookie set at login to avoid importing heavy auth/prisma.

export default function middleware(req: any) {
    const cookieHeader = req.headers?.get?.('cookie') || '';
    const path = req.nextUrl.pathname;

    // Check for NextAuth session cookie
    const hasSession =
        cookieHeader.includes('__Secure-next-auth.session-token') ||
        cookieHeader.includes('next-auth.session-token');

    if (!hasSession) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Extract user-role cookie value (format: "user-role=<role>; ...")
    let userRole = '';
    const cookies = cookieHeader.split(';');
    for (const cookie of cookies) {
        const trimmed = cookie.trim();
        if (trimmed.startsWith('user-role=')) {
            userRole = trimmed.substring('user-role='.length).trim();
            break;
        }
    }

    // Role-based redirects
    if (userRole) {
        if (path.startsWith('/dashboard/instructor') && userRole !== 'instructor') {
            return NextResponse.redirect(new URL('/dashboard/student', req.url));
        }
        if (path.startsWith('/dashboard/student') && userRole !== 'student') {
            return NextResponse.redirect(new URL('/dashboard/instructor', req.url));
        }
        if (path.startsWith('/dashboard/admin') && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/bookings/:path*',
        '/profile/:path*',
        '/messages/:path*',
    ],
};
