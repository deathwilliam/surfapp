import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function DELETE(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const bookingId = searchParams.get('bookingId');
        // console.log(`[DELETE MSG] Request for bookingId: ${bookingId}. User: ${session.user.id}`);

        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
        }

        // Verify user is part of the booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { instructor: true }
        });

        if (!booking) {
            console.log(`[DELETE MSG] Booking not found: ${bookingId}`);
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const isStudent = booking.studentId === session.user.id;
        const isInstructor = booking.instructor.userId === session.user.id;
        console.log(`[DELETE MSG] Auth Check: Student=${isStudent}, Instructor=${isInstructor}`);

        if (!isStudent && !isInstructor) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Delete all messages for this booking
        const deleted = await prisma.message.deleteMany({
            where: { bookingId },
        });
        console.log(`[DELETE MSG] Deleted count: ${deleted.count}`);

        return NextResponse.json({ success: true, count: deleted.count });
    } catch (error) {
        console.error('Error clearing messages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
