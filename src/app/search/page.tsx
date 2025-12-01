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
        where.instructorProfile.locations = {
            some: {
                id: locationId,
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
        <div className="container py-10">
            <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold">Encuentra tu Instructor</h1>
                <p className="text-muted-foreground">
                    Explora los mejores instructores de surf en El Salvador
                </p>
            </div>

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
    );
}
