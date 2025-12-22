import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ChatPageClient } from './ChatPageClient';

export const dynamic = 'force-dynamic';

export default async function ChatPage({ params }: { params: Promise<{ bookingId: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const { bookingId } = await params;

    console.log('[ChatPage] Received bookingId:', bookingId);

    // Verify user has access to this booking
    const booking = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            OR: [
                { studentId: session.user.id },
                { instructor: { userId: session.user.id } },
            ],
        },
        include: {
            student: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            instructor: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
        },
    });

    if (!booking) {
        redirect('/dashboard/messages');
    }

    const isInstructor = session.user.userType === 'instructor';
    const otherUserName = isInstructor
        ? `${booking.student.firstName} ${booking.student.lastName}`
        : `${booking.instructor.user.firstName} ${booking.instructor.user.lastName}`;

    return <ChatPageClient bookingId={bookingId} otherUserName={otherUserName} />;
}
