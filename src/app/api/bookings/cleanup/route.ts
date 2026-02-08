import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { BookingStatus } from '@prisma/client';

export async function DELETE(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');

    try {
        if (statusParam === 'cancelled') {
            // console.log('[Cleanup] Deleting cancelled bookings for user:', session.user.id);

            // First, get all cancelled booking IDs
            const cancelledBookings = await prisma.booking.findMany({
                where: {
                    studentId: session.user.id,
                    status: BookingStatus.cancelled,
                },
                select: {
                    id: true,
                },
            });

            const bookingIds = cancelledBookings.map(b => b.id);
            console.log('[Cleanup] Found', bookingIds.length, 'cancelled bookings');

            if (bookingIds.length > 0) {
                // Delete all related records first to avoid foreign key constraints

                // 1. Delete messages
                const deletedMessages = await prisma.message.deleteMany({
                    where: {
                        bookingId: { in: bookingIds },
                    },
                });
                console.log('[Cleanup] Deleted', deletedMessages.count, 'messages');

                // 2. Delete reviews
                const deletedReviews = await prisma.review.deleteMany({
                    where: {
                        bookingId: { in: bookingIds },
                    },
                });
                console.log('[Cleanup] Deleted', deletedReviews.count, 'reviews');

                // 3. Delete payments
                const deletedPayments = await prisma.payment.deleteMany({
                    where: {
                        bookingId: { in: bookingIds },
                    },
                });
                console.log('[Cleanup] Deleted', deletedPayments.count, 'payments');

                // 4. Now delete the bookings
                const result = await prisma.booking.deleteMany({
                    where: {
                        id: { in: bookingIds },
                    },
                });
                console.log('[Cleanup] Deleted', result.count, 'cancelled bookings');

                return NextResponse.json({ count: result.count });
            }

            return NextResponse.json({ count: 0 });
        }

        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    } catch (error) {
        console.error('Error cleaning bookings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
