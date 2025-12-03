import { requireAdmin } from '@/lib/admin-middleware';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/users - Get all users with filters
export async function GET(request: NextRequest) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { searchParams } = new URL(request.url);
        const userType = searchParams.get('userType');
        const search = searchParams.get('search');

        const where: any = {};

        if (userType) {
            where.userType = userType;
        }

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }

        const users = await prisma.user.findMany({
            where,
            include: {
                instructorProfile: {
                    select: {
                        isVerified: true,
                        averageRating: true,
                        totalReviews: true,
                    },
                },
                _count: {
                    select: {
                        bookingsAsStudent: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { error: 'Error al obtener usuarios' },
            { status: 500 }
        );
    }
}
