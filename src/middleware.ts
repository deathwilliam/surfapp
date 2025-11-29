import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { UserType } from '@prisma/client';

export default auth((req) => {
    const token = req.auth;
    const path = req.nextUrl.pathname;
    const isLoggedIn = !!token;

    // Redirect to login if not logged in
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Protect instructor routes
    if (path.startsWith('/dashboard/instructor') && token?.user?.userType !== UserType.instructor) {
        return NextResponse.redirect(new URL('/dashboard/student', req.url));
    }

    // Protect student routes
    if (path.startsWith('/dashboard/student') && token?.user?.userType !== UserType.student) {
        return NextResponse.redirect(new URL('/dashboard/instructor', req.url));
    }

    // Protect admin routes
    if (path.startsWith('/dashboard/admin') && token?.user?.userType !== UserType.admin) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/bookings/:path*',
        '/profile/:path*',
        '/messages/:path*',
    ],
};
