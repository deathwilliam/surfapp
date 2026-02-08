import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { SearchFilters } from '@/components/search/SearchFilters';
import { InstructorCard } from '@/components/search/InstructorCard';
import { UserType } from '@prisma/client';

// Fetch locations for filters
async function getLocations() {
    return await prisma.location.findMany({
        select: { id: true, name: true },
    });
}

// Fetch instructors based on filters
async function getInstructors(searchParams: {
    locationId?: string;
    minPrice?: string;
    maxPrice?: string;
    level?: string;
}) {
    const { locationId, minPrice, maxPrice, level } = searchParams;

    const where: any = {
        userType: UserType.instructor,
        instructorProfile: {
            isNot: null,
        },
    };

    if (locationId && locationId !== 'all') {
        where.instructorProfile.availability = {
            some: {
                locationId: locationId,
            },
        };
    }

    if (minPrice || maxPrice) {
        where.instructorProfile.hourlyRate = {};
        if (minPrice) where.instructorProfile.hourlyRate.gte = parseFloat(minPrice);
        if (maxPrice) where.instructorProfile.hourlyRate.lte = parseFloat(maxPrice);
    }

    if (level && level !== 'all') {
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
                    averageRating: true,
                    totalReviews: true,
                    specialties: true,
                },
            },
        },
    });

    return instructors.map((inst) => ({
        id: inst.id,
        name: `${inst.firstName} ${inst.lastName}`,
        image: inst.profileImageUrl,
        bio: inst.instructorProfile?.bio || '',
        hourlyRate: Number(inst.instructorProfile?.hourlyRate) || 0,
        rating: Number(inst.instructorProfile?.averageRating) || 0,
        reviewCount: inst.instructorProfile?.totalReviews || 0,
        specialties: (inst.instructorProfile?.specialties as string[]) || [],
        locations: [],
    }));
}

export default async function SearchPage(props: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const locations = await getLocations();
    const instructors = await getInstructors(searchParams);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FFD23F]/10 to-white">
            {/* Header Section with Surf City Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#00D4D4] via-[#00B8B8] to-[#FF6B35] py-16 text-white">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlcyIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI1MCI+PHBhdGggZD0iTTAgMjVRMjUgMCA1MCAyNVQxMDAgMjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN3YXZlcykiLz48L3N2Zz4=')] opacity-30"></div>
                </div>

                <div className="container relative z-10">
                    <h1 className="font-heading text-4xl font-bold md:text-5xl drop-shadow-md">
                        Encuentra tu Instructor en Surf City
                    </h1>
                    <p className="mt-3 text-lg text-white/95 drop-shadow">
                        Explora los mejores instructores de surf en El Salvador - El Tunco, El Sunzal, Punta Roca y más
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-sm">
                        <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                            {instructors.length} instructores disponibles
                        </span>
                    </div>
                </div>
            </div>

            <div className="container py-10">
                <div className="grid gap-8 lg:grid-cols-4">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1">
                        <Suspense fallback={<div>Cargando filtros...</div>}>
                            <SearchFilters locations={locations} />
                        </Suspense>
                    </div>

                    {/* Results Grid */}
                    <div className="lg:col-span-3">
                        {instructors.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {instructors.map((instructor) => (
                                    <InstructorCard key={instructor.id} instructor={instructor} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                                <div className="text-4xl">🏄‍♂️</div>
                                <h3 className="mt-4 text-lg font-semibold">
                                    No se encontraron instructores
                                </h3>
                                <p className="text-muted-foreground">
                                    Intenta ajustar tus filtros de búsqueda
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
