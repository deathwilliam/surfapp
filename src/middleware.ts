import { NextResponse } from 'next/server';

// Minimal Edge middleware: only check for presence of the NextAuth session
// cookie in the raw Cookie header. This file is intentionally tiny to keep
// the Edge Function well below Vercel size limits. Move any role checks to
// server-side handlers where the full auth stack is available.

export default function middleware(req: any) {
    const cookieHeader = req.headers?.get?.('cookie') || '';

    const hasSession =
        cookieHeader.includes('__Secure-next-auth.session-token') ||
        cookieHeader.includes('next-auth.session-token');

    if (!hasSession) {
        return NextResponse.redirect(new URL('/login', req.url));
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
