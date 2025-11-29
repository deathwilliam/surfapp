import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const messageSchema = z.object({
    bookingId: z.string().uuid(),
    messageText: z.string().min(1, 'El mensaje no puede estar vacío'),
});

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const bookingId = searchParams.get('bookingId');

        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ID requerido' }, { status: 400 });
        }

        // Verify user is part of the booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                instructor: true,
            },
        });

        if (!booking) {
            return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
        }

        const isStudent = booking.studentId === session.user.id;
        const isInstructor = booking.instructor.userId === session.user.id;

        if (!isStudent && !isInstructor) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
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
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const validation = messageSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues }, { status: 400 });
        }

        const { bookingId, messageText } = validation.data;

        // Verify booking and determine receiver
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                instructor: true,
            },
        });

        if (!booking) {
            return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
        }

        let receiverId: string;

        if (booking.studentId === session.user.id) {
            receiverId = booking.instructor.userId;
        } else if (booking.instructor.userId === session.user.id) {
            receiverId = booking.studentId;
        } else {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
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
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
