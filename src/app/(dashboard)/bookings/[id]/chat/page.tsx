import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ChatWindow } from '@/components/messages/ChatWindow';

interface ChatPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const bookingId = id;

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
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
    const isStudent = session.user.userType === 'student';

    // Verify user is part of the booking
    if (
        (isInstructor && booking.instructor.userId !== session.user.id) ||
        (isStudent && booking.studentId !== session.user.id)
    ) {
        redirect('/dashboard');
    }

    const otherUserName = isInstructor
        ? `${booking.student.firstName} ${booking.student.lastName}`
        : `${booking.instructor.user.firstName} ${booking.instructor.user.lastName}`;

    return (
        <div className="container max-w-3xl py-10">
            <ChatWindow bookingId={bookingId} otherUserName={otherUserName} />
        </div>
    );
}

