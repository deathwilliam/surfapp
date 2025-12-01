import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const profileSchema = z.object({
    bio: z.string().min(10, 'La biografía debe tener al menos 10 caracteres'),
    experienceYears: z.coerce.number().min(0, 'Los años de experiencia no pueden ser negativos'),
    hourlyRate: z.coerce.number().min(1, 'El precio por hora debe ser mayor a 0'),
    specialties: z.array(z.string()).min(1, 'Debes seleccionar al menos una especialidad'),
});

export async function PUT(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user || session.user.userType !== 'instructor') {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const result = profileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { bio, experienceYears, hourlyRate, specialties } = result.data;

        // Update instructor profile
        // Note: Locations are handled as a relation, so we need to connect them
        // First we need to find the location IDs based on names or IDs passed
        // Assuming frontend sends IDs for locations

        const updatedProfile = await prisma.instructorProfile.update({
            where: { userId: session.user.id },
            data: {
                bio,
                experienceYears,
                hourlyRate,
                specialties,
            },
        });

        return NextResponse.json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el perfil' },
            { status: 500 }
        );
    }
}
