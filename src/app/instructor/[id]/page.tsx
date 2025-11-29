import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { InstructorHeader } from '@/components/instructor/InstructorHeader';
import { BookingWidget } from '@/components/instructor/BookingWidget';
import { Separator } from '@/components/ui/separator';

async function getInstructor(id: string) {
    const instructor = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            instructorProfile: {
                select: {
                    id: true,
                    bio: true,
                    experienceYears: true,
                    hourlyRate: true,
                    averageRating: true,
                    totalReviews: true,
                    specialties: true,
                    isVerified: true,
                },
            },
        },
    });

    if (!instructor || !instructor.instructorProfile) {
        return null;
    }

    return {
        id: instructor.id,
        name: `${instructor.firstName} ${instructor.lastName}`,
        image: instructor.profileImageUrl,
        bio: instructor.instructorProfile.bio,
        experienceYears: instructor.instructorProfile.experienceYears,
        hourlyRate: Number(instructor.instructorProfile.hourlyRate),
        rating: Number(instructor.instructorProfile.averageRating),
        reviewCount: instructor.instructorProfile.totalReviews,
        specialties: (instructor.instructorProfile.specialties as string[]) || [],
        isVerified: instructor.instructorProfile.isVerified,
        locations: [],
    };
}

async function getAvailability(instructorId: string) {
    const slots = await prisma.instructorAvailability.findMany({
        where: {
            instructorId,
            date: {
                gte: new Date(), // Only future slots
            },
        },
        orderBy: {
            date: 'asc',
        },
        take: 30, // Limit to next 30 slots
    });

    return slots.map((slot) => ({
        id: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable,
        maxStudents: slot.maxStudents,
        currentBookings: slot.currentBookings,
    }));
}

export default async function InstructorProfilePage({
    params,
}: {
    params: { id: string };
}) {
    const instructor = await getInstructor(params.id);
    const availability = await getAvailability(params.id);

    if (!instructor) {
        notFound();
    }

    return (
        <div className="container py-10">
            <InstructorHeader instructor={instructor} />

            <Separator className="my-8" />

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="mb-4 font-heading text-2xl font-bold">Sobre mí</h2>
                        <p className="text-muted-foreground whitespace-pre-line">
                            {instructor.bio || 'Este instructor aún no ha agregado una biografía.'}
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 font-heading text-2xl font-bold">Experiencia</h2>
                        <div className="rounded-lg border bg-card p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Años de experiencia
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {instructor.experienceYears} años
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Precio por hora
                                    </p>
                                    <p className="text-lg font-semibold">
                                        ${instructor.hourlyRate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <h2 className="mb-4 font-heading text-xl font-bold">
                            Reservar Clase
                        </h2>
                        <BookingWidget slots={availability} instructor={instructor} />
                    </div>
                </div>
            </div>
        </div>
    );
}
