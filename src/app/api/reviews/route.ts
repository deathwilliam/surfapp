import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { BookingStatus } from '@prisma/client';

const reviewSchema = z.object({
    bookingId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const validation = reviewSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues }, { status: 400 });
        }

        const { bookingId, rating, comment } = validation.data;

        // Verify booking eligibility
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                review: true,
            },
        });

        if (!booking) {
            return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
        }

        if (booking.studentId !== session.user.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        if (booking.status !== BookingStatus.completed) {
            return NextResponse.json(
                { error: 'Solo se pueden calificar reservas completadas' },
                { status: 400 }
            );
        }

        if (booking.review) {
            return NextResponse.json(
                { error: 'Ya has calificado esta reserva' },
                { status: 400 }
            );
        }

        // Transaction: Create review AND update instructor stats
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Review
            const review = await tx.review.create({
                data: {
                    bookingId,
                    studentId: session.user.id!,
                    instructorId: booking.instructorId,
                    rating,
                    comment,
                },
            });

            // 2. Recalculate Instructor Stats
            const instructorReviews = await tx.review.findMany({
                where: { instructorId: booking.instructorId },
                select: { rating: true },
            });

            const totalReviews = instructorReviews.length;
            const sumRatings = instructorReviews.reduce((acc, curr) => acc + curr.rating, 0);
            const averageRating = totalReviews > 0 ? sumRatings / totalReviews : 0;

            // 3. Update Instructor Profile
            await tx.instructorProfile.update({
                where: { id: booking.instructorId },
                data: {
                    totalReviews,
                    averageRating,
                },
            });

            return review;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
