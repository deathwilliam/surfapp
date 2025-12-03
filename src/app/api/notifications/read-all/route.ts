import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// PATCH /api/notifications/read-all - Mark all notifications as read
export async function PATCH() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        await prisma.notification.updateMany({
            where: {
                userId: session.user.id,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Mark all as read error:', error);
        return NextResponse.json(
            { error: 'Error al marcar todas como leídas' },
            { status: 500 }
        );
    }
}
