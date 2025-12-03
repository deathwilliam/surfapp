import { requireAdmin } from '@/lib/admin-middleware';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/admin/stats - Get platform statistics
export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const [
            totalUsers,
            totalInstructors,
            totalStudents,
            totalBookings,
            completedBookings,
            pendingVerifications,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { userType: 'instructor' } }),
            prisma.user.count({ where: { userType: 'student' } }),
            prisma.booking.count(),
            prisma.booking.count({ where: { status: 'completed' } }),
            prisma.instructorProfile.count({ where: { isVerified: false } }),
        ]);

        // Calculate total revenue (from completed bookings)
        const revenueData = await prisma.booking.aggregate({
            where: { status: 'completed' },
            _sum: { price: true },
        });

        const totalRevenue = Number(revenueData._sum.price || 0);

        return NextResponse.json({
            totalUsers,
            totalInstructors,
            totalStudents,
            totalBookings,
            completedBookings,
            pendingVerifications,
            totalRevenue,
        });
    } catch (error) {
        console.error('Get stats error:', error);
        return NextResponse.json(
            { error: 'Error al obtener estadísticas' },
            { status: 500 }
        );
    }
}
