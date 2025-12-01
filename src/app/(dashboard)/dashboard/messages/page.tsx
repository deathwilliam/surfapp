import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ConversationList } from '@/components/messages/ConversationList';

export default async function MessagesPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const isInstructor = session.user.userType === 'instructor';

    // Fetch bookings where the user is involved
    const bookings = await prisma.booking.findMany({
        where: {
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
                    profileImageUrl: true,
                },
            },
            instructor: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            profileImageUrl: true,
                        },
                    },
                },
            },
            messages: {
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    // Transform data for the view
    const conversations = bookings.map((booking) => {
        const otherUser = isInstructor
            ? {
                name: `${booking.student.firstName} ${booking.student.lastName}`,
                image: booking.student.profileImageUrl,
            }
            : {
                name: `${booking.instructor.user.firstName} ${booking.instructor.user.lastName}`,
                image: booking.instructor.user.profileImageUrl,
            };

        return {
            id: booking.id,
            otherUser,
            lastMessage: booking.messages[0]
                ? {
                    text: booking.messages[0].messageText,
                    createdAt: booking.messages[0].createdAt,
                }
                : undefined,
            bookingDate: booking.bookingDate,
            status: booking.status,
        };
    });

    return (
        <div className="container py-6">
            <h1 className="mb-6 font-heading text-3xl font-bold">Mensajes</h1>
            <ConversationList conversations={conversations} />
        </div>
    );
}
