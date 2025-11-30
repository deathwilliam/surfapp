import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
        // If no bookingId, return list of conversations (bookings with messages)
        // This is a bit complex, so for MVP let's focus on messages for a booking
        // Or we can implement a separate /api/conversations endpoint
        return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
    }

    try {
        // Verify user is part of the booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                student: true,
                instructor: {
                    include: { user: true }
                }
            }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const isStudent = booking.studentId === session.user.id;
        const isInstructor = booking.instructor.userId === session.user.id;

        if (!isStudent && !isInstructor) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: { bookingId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImageUrl: true,
                    },
                },
            },
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { bookingId, messageText } = body;

        if (!bookingId || !messageText) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify booking and determine receiver
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                instructor: true,
            },
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        let receiverId: string;

        if (booking.studentId === session.user.id) {
            // Sender is student, receiver is instructor
            receiverId = booking.instructor.userId;
        } else if (booking.instructor.userId === session.user.id) {
            // Sender is instructor, receiver is student
            receiverId = booking.studentId;
        } else {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const message = await prisma.message.create({
            data: {
                bookingId,
                senderId: session.user.id,
                receiverId,
                messageText,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImageUrl: true,
                    },
                },
            },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
