import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { bookingId } = await request.json();

        if (!bookingId) {
            return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
        }

        // Update all unread messages in this booking sent to the current user
        const result = await prisma.message.updateMany({
            where: {
                bookingId: bookingId,
                receiverId: session.user.id,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });

        return NextResponse.json({ count: result.count });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
