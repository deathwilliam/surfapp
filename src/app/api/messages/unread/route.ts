import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ count: 0 });
    }

    try {
        const count = await prisma.message.count({
            where: {
                receiverId: session.user.id,
                isRead: false,
            },
        });

        return NextResponse.json({ count });
    } catch (error) {
        console.error('Error fetching unread messages count:', error);
        return NextResponse.json({ count: 0 });
    }
}
