import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { BookingStatus } from '@prisma/client';

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
        const body = await request.json();
        const { status, cancellationReason } = body;

        // Validate status
        if (!Object.values(BookingStatus).includes(status)) {
            return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
        }

        // Get booking with relations
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                instructor: { include: { user: true } },
                student: true,
            },
        });

        if (!booking) {
            return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
        }

        // Authorization checks
        const isStudent = booking.studentId === session.user.id;
        const isInstructor = booking.instructor.userId === session.user.id;

        if (!isStudent && !isInstructor) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        // Business logic for status transitions
        switch (status) {
            case BookingStatus.confirmed:
                // Only instructor can confirm
                if (!isInstructor) {
                    return NextResponse.json(
                        { error: 'Solo el instructor puede confirmar' },
                        { status: 403 }
                    );
                }
                if (booking.status !== BookingStatus.pending) {
                    return NextResponse.json(
                        { error: 'Solo se pueden confirmar reservas pendientes' },
                        { status: 400 }
                    );
                }
                break;

            case BookingStatus.cancelled:
                // Both can cancel, but only pending or confirmed bookings
                if (![BookingStatus.pending, BookingStatus.confirmed].includes(booking.status)) {
                    return NextResponse.json(
                        { error: 'No se puede cancelar esta reserva' },
                        { status: 400 }
                    );
                }
                if (!cancellationReason) {
                    return NextResponse.json(
                        { error: 'Se requiere una razón de cancelación' },
                        { status: 400 }
                    );
                }
                break;

            case BookingStatus.completed:
                // Only instructor can mark as completed
                if (!isInstructor) {
                    return NextResponse.json(
                        { error: 'Solo el instructor puede completar' },
                        { status: 403 }
                    );
                }
                if (booking.status !== BookingStatus.confirmed) {
                    return NextResponse.json(
                        { error: 'Solo se pueden completar reservas confirmadas' },
                        { status: 400 }
                    );
                }
                break;

            case BookingStatus.no_show:
                // Only instructor can mark as no-show
                if (!isInstructor) {
                    return NextResponse.json(
                        { error: 'Solo el instructor puede marcar como no show' },
                        { status: 403 }
                    );
                }
                if (booking.status !== BookingStatus.confirmed) {
                    return NextResponse.json(
                        { error: 'Solo se pueden marcar como no show reservas confirmadas' },
                        { status: 400 }
                    );
                }
                break;

            default:
                return NextResponse.json({ error: 'Transición de estado inválida' }, { status: 400 });
        }

        // Update booking
        const updatedBooking = await prisma.$transaction(async (tx) => {
            // Update booking status
            const updated = await tx.booking.update({
                where: { id },
                data: {
                    status,
                    ...(status === BookingStatus.cancelled && {
                        cancellationReason,
                        cancelledBy: session.user.id,
                        cancelledAt: new Date(),
                    }),
                },
                include: {
                    instructor: { include: { user: true } },
                    student: true,
                    location: true,
                },
            });

            // If cancelled, restore availability
            if (status === BookingStatus.cancelled && booking.availabilityId) {
                await tx.instructorAvailability.update({
                    where: { id: booking.availabilityId },
                    data: {
                        currentBookings: { decrement: 1 },
                        isAvailable: true,
                    },
                });
            }

            // Create notification for the other party
            const recipientId = isInstructor ? booking.studentId : booking.instructor.userId;
            let notificationMessage = '';

            switch (status) {
                case BookingStatus.confirmed:
                    notificationMessage = `Tu reserva ha sido confirmada por ${booking.instructor.user.firstName}`;
                    break;
                case BookingStatus.cancelled:
                    notificationMessage = `Tu reserva ha sido cancelada`;
                    break;
                case BookingStatus.completed:
                    notificationMessage = `Tu clase ha sido completada. ¡Deja una reseña!`;
                    break;
                case BookingStatus.no_show:
                    notificationMessage = `Reserva marcada como no show`;
                    break;
            }

            await tx.notification.create({
                data: {
                    userId: recipientId,
                    type: 'booking_update',
                    title: 'Actualización de Reserva',
                    message: notificationMessage,
                    relatedEntityType: 'booking',
                    relatedEntityId: booking.id,
                },
            });

            return updated;
        });

        return NextResponse.json(updatedBooking);
    } catch (error) {
        console.error('Update booking status error:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el estado de la reserva' },
            { status: 500 }
        );
    }
}
