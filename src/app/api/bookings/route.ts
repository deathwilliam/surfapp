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

        // Send notification email to instructor
        try {
            if (process.env.RESEND_API_KEY) {
                const { resend } = await import('@/lib/resend');
                const { BookingNotificationEmail } = await import('@/components/emails/BookingNotificationEmail');

                // Fetch instructor email and details
                const instructor = await prisma.user.findUnique({
                    where: { id: instructorId },
                });

                const location = await prisma.location.findUnique({
                    where: { id: availability.locationId },
                });

                if (instructor && location) {
                    await resend.emails.send({
                        from: 'SurfConnect <bookings@resend.dev>',
                        to: instructor.email,
                        subject: 'Nueva Solicitud de Reserva',
                        react: BookingNotificationEmail({
                            instructorName: instructor.firstName,
                            studentName: session.user.firstName || 'Un estudiante',
                            date: new Date(availability.date).toLocaleDateString('es-ES'),
                            time: `${new Date(availability.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - ${new Date(availability.endTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
                            location: location.name,
                            bookingId: booking.id,
                        }),
                    });
                }
            }
        } catch (emailError) {
            console.error('Error sending booking email:', emailError);
        }

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json(
            { error: 'Error al crear la reserva' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        // Get all bookings for the logged-in user (as student)
        const bookings = await prisma.booking.findMany({
            where: { studentId: session.user.id },
            include: {
                instructor: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profileImageUrl: true,
                                email: true,
                            },
                        },
                    },
                },
                location: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        address: true,
                    },
                },
                payment: {
                    select: {
                        id: true,
                        status: true,
                        amount: true,
                    },
                },
                review: {
                    select: {
                        id: true,
                        rating: true,
                    },
                },
            },
            orderBy: {
                bookingDate: 'desc',
            },
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error);
        return NextResponse.json(
            { error: 'Error al obtener reservas' },
            { status: 500 }
        );
    }
}
