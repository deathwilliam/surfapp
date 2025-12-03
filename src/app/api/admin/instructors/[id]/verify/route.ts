import { requireAdmin } from '@/lib/admin-middleware';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/admin/instructors/[id]/verify - Verify instructor
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { id } = await params;

        const instructorProfile = await prisma.instructorProfile.update({
            where: { userId: id },
            data: { isVerified: true },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        email: true,
                    },
                },
            },
        });

        // Create notification for instructor
        await prisma.notification.create({
            data: {
                userId: instructorProfile.user.id,
                type: 'verification',
                title: 'Perfil Verificado',
                message: `¡Felicidades ${instructorProfile.user.firstName}! Tu perfil de instructor ha sido verificado.`,
                relatedEntityType: 'instructor_profile',
                relatedEntityId: instructorProfile.id,
            },
        });

        return NextResponse.json(instructorProfile);
    } catch (error) {
        console.error('Verify instructor error:', error);
        return NextResponse.json(
            { error: 'Error al verificar instructor' },
            { status: 500 }
        );
    }
}
