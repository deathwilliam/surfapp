import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateProfileSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string().optional(),
    profileImageUrl: z.string().url().optional().or(z.literal('')),
});

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = updateProfileSchema.parse(body);

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                phone: validatedData.phone || null,
                profileImageUrl: validatedData.profileImageUrl || null,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                profileImageUrl: true,
                userType: true,
            },
        });

        return NextResponse.json({
            message: 'Perfil actualizado exitosamente',
            user: updatedUser,
        });
    } catch (error: any) {
        console.error('Profile update error:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                {
                    error: 'Datos inválidos',
                    details: error.errors,
                },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: 'Error al actualizar perfil' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                profileImageUrl: true,
                userType: true,
                createdAt: true,
                emailVerified: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Error al obtener perfil' }, { status: 500 });
    }
}
