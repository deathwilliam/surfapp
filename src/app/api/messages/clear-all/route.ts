import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function DELETE(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log(`[CLEAR ALL] User: ${session.user.id} requesting clear all.`);

        // Delete all messages where the user is sender or receiver
        const deleted = await prisma.message.deleteMany({
            where: {
                OR: [
                    { senderId: session.user.id },
                    { receiverId: session.user.id },
                ],
            },
        });
        console.log(`[CLEAR ALL] Deleted count: ${deleted.count}`);

        return NextResponse.json({ success: true, count: deleted.count });
    } catch (error) {
        console.error('Error clearing all messages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
