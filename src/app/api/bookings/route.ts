import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { BookingStatus, PaymentStatus } from '@prisma/client';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { instructorId, availabilityId } = body;

        if (!instructorId || !availabilityId) {
            return NextResponse.json(
                { error: 'Faltan datos requeridos' },
                { status: 400 }
            );
        }

        // Check availability
        const availability = await prisma.instructorAvailability.findUnique({
            where: { id: availabilityId },
        });

        if (!availability) {
            return NextResponse.json(
                { error: 'Horario no encontrado' },
                { status: 404 }
            );
        }

        // Check if slot has availability
        if (!availability.isAvailable || availability.currentBookings >= availability.maxStudents) {
            return NextResponse.json(
                { error: 'Este horario ya no tiene disponibilidad' },
                { status: 400 }
            );
        }

        // Create booking transaction
        const booking = await prisma.$transaction(async (tx) => {
            // Get instructor profile for pricing
            const instructorProfile = await tx.instructorProfile.findUnique({
                where: { userId: instructorId },
                select: { hourlyRate: true, id: true },
            });

            if (!instructorProfile) {
                throw new Error('Perfil de instructor no encontrado');
            }

            // Calculate duration and price
            const price = Number(instructorProfile.hourlyRate);

            // 1. Create booking
            const newBooking = await tx.booking.create({
                data: {
                    studentId: session.user.id,
                    instructorId: instructorProfile.id,
                    availabilityId,
                    locationId: availability.locationId,
                    bookingDate: availability.date,
                    startTime: availability.startTime,
                    endTime: availability.endTime,
                    status: BookingStatus.pending,
                    price,
                },
            });

            // 2. Update availability
            await tx.instructorAvailability.update({
                where: { id: availabilityId },
                data: {
                    currentBookings: { increment: 1 },
                    isAvailable: availability.currentBookings + 1 >= availability.maxStudents ? false : true,
                },
            });

            return newBooking;
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json(
            { error: 'Error al crear la reserva' },
            { status: 500 }
        );
    }
}
