import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';

// Cached queries for frequently accessed data

// Cache locations for 1 hour
export const getCachedLocations = unstable_cache(
    async () => {
        return prisma.location.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    },
    ['locations'],
    { revalidate: 3600, tags: ['locations'] }
);

// Cache featured instructors for 30 minutes
export const getCachedFeaturedInstructors = unstable_cache(
    async (limit = 6) => {
        return prisma.instructorProfile.findMany({
            where: { isVerified: true },
            orderBy: { averageRating: 'desc' },
            take: limit,
            select: {
                id: true,
                bio: true,
                hourlyRate: true,
                averageRating: true,
                totalReviews: true,
                specialties: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImageUrl: true,
                    },
                },
            },
        });
    },
    ['featured-instructors'],
    { revalidate: 1800, tags: ['instructors'] }
);

// Cache stats for 5 minutes
export const getCachedStats = unstable_cache(
    async () => {
        const [classesCount, instructorsCount, ratingResult] = await Promise.all([
            prisma.booking.count({ where: { status: 'completed' } }),
            prisma.instructorProfile.count({ where: { isVerified: true } }),
            prisma.review.aggregate({ _avg: { rating: true } }),
        ]);

        return {
            totalClasses: classesCount,
            totalInstructors: instructorsCount,
            avgRating: ratingResult._avg.rating ? Number(ratingResult._avg.rating.toFixed(1)) : 0,
        };
    },
    ['landing-stats'],
    { revalidate: 300, tags: ['stats'] }
);
