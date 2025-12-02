import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { BookingStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const statusSchema = z.object({
    status: z.enum(['confirmed', 'cancelled']),
});

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const result = statusSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Estado inválido' },
                { status: 400 }
            );
        }

        const { status } = result.data;
        const normalizedStatus = status.toLowerCase() as BookingStatus;

        // Verify booking ownership
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                instructor: true,
            },
        });

        if (!booking) {
            return NextResponse.json(
                { error: 'Reserva no encontrada' },
                { status: 404 }
            );
        }

        // Allow both instructor and student to cancel
        const isInstructor = session.user.userType === 'instructor' && booking.instructor.userId === session.user.id;
        const isStudent = session.user.userType === 'student' && booking.studentId === session.user.id;

        if (!isInstructor && !isStudent) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        // Update booking status
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status: normalizedStatus },
        });

        // If cancelled, free up the slot
        if (normalizedStatus === 'cancelled') {
            await prisma.instructorAvailability.update({
                where: { id: booking.availabilityId! },
                data: { isAvailable: true },
            });
        }

        return NextResponse.json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json(
            { error: 'Error al actualizar la reserva' },
            { status: 500 }
        );
    }
}
