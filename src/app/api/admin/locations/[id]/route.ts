import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { UserType } from '@prisma/client';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user || session.user.userType !== UserType.admin) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id } = await params;

        // Check if location has related records (availability/bookings)
        const location = await prisma.location.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { availabilities: true, bookings: true },
                },
            },
        });

        if (!location) {
            return NextResponse.json({ error: 'Ubicación no encontrada' }, { status: 404 });
        }

        if (location._count.availabilities > 0 || location._count.bookings > 0) {
            return NextResponse.json(
                { error: 'No se puede eliminar: Hay reservas o disponibilidad asociada' },
                { status: 400 }
            );
        }

        await prisma.location.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Ubicación eliminada' });
    } catch (error) {
        console.error('Error deleting location:', error);
        return NextResponse.json(
            { error: 'Error al eliminar ubicación' },
            { status: 500 }
        );
    }
}
