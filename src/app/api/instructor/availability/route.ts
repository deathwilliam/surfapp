import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createSlotsSchema = z.object({
    date: z.string(), // ISO date string YYYY-MM-DD
    locationId: z.string(),
    timeSlots: z.array(
        z.object({
            startTime: z.string(), // HH:mm
            endTime: z.string(), // HH:mm
        })
    ),
});

export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user || session.user.userType !== 'instructor') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Get instructor profile ID
        const profile = await prisma.instructorProfile.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        });

        if (!profile) {
            return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
        }

        const { searchParams } = new URL(req.url);
        const start = searchParams.get('start');
        const end = searchParams.get('end');

        if (!start || !end) {
            return NextResponse.json(
                { error: 'Se requieren fechas de inicio y fin' },
                { status: 400 }
            );
        }

        const slots = await prisma.instructorAvailability.findMany({
            where: {
                instructorId: profile.id,
                date: {
                    gte: new Date(start),
                    lte: new Date(end),
                },
            },
            include: {
                location: {
                    select: { id: true, name: true },
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        return NextResponse.json(slots);
    } catch (error) {
        console.error('Error fetching availability:', error);
        return NextResponse.json(
            { error: 'Error al obtener disponibilidad' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user || session.user.userType !== 'instructor') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Get instructor profile ID
        const profile = await prisma.instructorProfile.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        });

        if (!profile) {
            return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
        }

        const body = await req.json();
        const result = createSlotsSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { date, locationId, timeSlots } = result.data;
        const baseDate = new Date(date);

        // Create availability records
        const createdSlots = await prisma.$transaction(
            timeSlots.map((slot) => {
                const [startHour, startMinute] = slot.startTime.split(':').map(Number);
                const [endHour, endMinute] = slot.endTime.split(':').map(Number);

                const startTime = new Date();
                startTime.setHours(startHour, startMinute, 0, 0);

                const endTime = new Date();
                endTime.setHours(endHour, endMinute, 0, 0);

                return prisma.instructorAvailability.create({
                    data: {
                        instructorId: profile.id,
                        locationId,
                        date: baseDate,
                        startTime,
                        endTime,
                        isAvailable: true,
                    },
                });
            })
        );

        return NextResponse.json(createdSlots);
    } catch (error) {
        console.error('Error creating availability:', error);
        return NextResponse.json(
            { error: 'Error al crear disponibilidad' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user || session.user.userType !== 'instructor') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Get instructor profile ID
        const profile = await prisma.instructorProfile.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        });

        if (!profile) {
            return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID de slot requerido' },
                { status: 400 }
            );
        }

        // Verify ownership and booking status
        const slot = await prisma.instructorAvailability.findUnique({
            where: { id },
        });

        if (!slot) {
            return NextResponse.json({ error: 'Slot no encontrado' }, { status: 404 });
        }

        if (slot.instructorId !== profile.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        if (!slot.isAvailable) {
            return NextResponse.json(
                { error: 'No se puede eliminar un horario reservado' },
                { status: 400 }
            );
        }

        await prisma.instructorAvailability.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting availability:', error);
        return NextResponse.json(
            { error: 'Error al eliminar disponibilidad' },
            { status: 500 }
        );
    }
}
