import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UserType, StudentLevel } from '@prisma/client';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const locationId = searchParams.get('locationId');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const level = searchParams.get('level');

        // Build filter conditions
        const where: any = {
            userType: UserType.instructor,
            instructorProfile: {
                isNot: null,
            },
        };

        // Filter by location if provided
        if (locationId) {
            where.instructorProfile.locations = {
                some: {
                    id: locationId,
                },
            };
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            where.instructorProfile.hourlyRate = {};
            if (minPrice) where.instructorProfile.hourlyRate.gte = parseFloat(minPrice);
            if (maxPrice) where.instructorProfile.hourlyRate.lte = parseFloat(maxPrice);
        }

        // Filter by level (specialties)
        // Note: This is a simple text match for now, ideally should use array contains
        if (level) {
            where.instructorProfile.specialties = {
                has: level,
            };
        }

        const instructors = await prisma.user.findMany({
            where,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true,
                instructorProfile: {
                    select: {
                        bio: true,
                        hourlyRate: true,
                        experienceYears: true,
                        averageRating: true,
                        totalReviews: true,
                        specialties: true,
                    },
                },
            },
        });

        // Transform data for frontend
        const formattedInstructors = instructors.map((instructor) => ({
            id: instructor.id,
            name: `${instructor.firstName} ${instructor.lastName}`,
            image: instructor.profileImageUrl,
            bio: instructor.instructorProfile?.bio,
            hourlyRate: Number(instructor.instructorProfile?.hourlyRate) || 0,
            rating: Number(instructor.instructorProfile?.averageRating) || 0,
            reviewCount: instructor.instructorProfile?.totalReviews || 0,
            specialties: (instructor.instructorProfile?.specialties as string[]) || [],
            locations: [],
        }));

        return NextResponse.json(formattedInstructors);
    } catch (error) {
        console.error('Error fetching instructors:', error);
        return NextResponse.json(
            { error: 'Error al buscar instructores' },
            { status: 500 }
        );
    }
}
