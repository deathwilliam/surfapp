import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// Secure Edge middleware using JWT token validation
// Validates session and role from cryptographically signed token

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Get JWT token (validates signature automatically)
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // No valid token = redirect to login
    if (!token) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('callbackUrl', path);
        return NextResponse.redirect(loginUrl);
    }

    // Extract role from verified token (not spoofeable)
    const userRole = token.role as string | undefined;

    // Role-based access control
    if (path.startsWith('/dashboard/instructor')) {
        if (userRole !== 'instructor' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard/student', req.url));
        }
    }

    if (path.startsWith('/dashboard/student')) {
        if (userRole !== 'student' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard/instructor', req.url));
        }
    }

    if (path.startsWith('/dashboard/admin')) {
        if (userRole !== 'admin') {
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

