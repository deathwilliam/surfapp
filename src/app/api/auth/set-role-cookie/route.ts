import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const secret = process.env.NEXTAUTH_SECRET as string;

        const token = await getToken({ req: request as any, secret });

        if (!token || !token.sub) {
            return NextResponse.json({ error: 'No session' }, { status: 401 });
        }

        // token.sub should be the user id
        const userId = token.sub as string;

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { userType: true } });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const res = NextResponse.json({ ok: true });

        // Set a small cookie with the user role so Edge middleware can read it
        // Note: Cannot use HttpOnly here as middleware/Edge needs to read it
        res.cookies.set('user-role', user.userType, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return res;
    } catch (err) {
        console.error('set-role-cookie error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
