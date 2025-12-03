import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/notifications/[id]/read - Mark notification as read
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id } = await params;

        const notification = await prisma.notification.update({
            where: {
                id,
                userId: session.user.id, // Ensure user owns the notification
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });

        return NextResponse.json(notification);
    } catch (error) {
        console.error('Mark notification as read error:', error);
        return NextResponse.json(
            { error: 'Error al marcar notificación como leída' },
            { status: 500 }
        );
    }
}
