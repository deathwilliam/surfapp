import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { InstructorHeader } from '@/components/instructor/InstructorHeader';
import { BookingWidget } from '@/components/instructor/BookingWidget';
import { Separator } from '@/components/ui/separator';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function InstructorProfilePage({ params }: PageProps) {
    // Await params for Next.js 15 compatibility
    const { id } = await params;

    // Fetch instructor data
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            instructorProfile: true,
        },
    });

    if (!user || !user.instructorProfile) {
        notFound();
    }

    // Fetch availability
    const availabilitySlots = await prisma.instructorAvailability.findMany({
        where: {
            instructorId: user.instructorProfile.id,
            date: {
                gte: new Date(),
            },
        },
        orderBy: {
            date: 'asc',
        },
        take: 30,
    });

    // Prepare instructor data
    const instructor = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        image: user.profileImageUrl,
        bio: user.instructorProfile.bio,
        experienceYears: user.instructorProfile.experienceYears,
        hourlyRate: Number(user.instructorProfile.hourlyRate),
        rating: Number(user.instructorProfile.averageRating),
        reviewCount: user.instructorProfile.totalReviews,
        specialties: Array.isArray(user.instructorProfile.specialties)
            ? (user.instructorProfile.specialties as string[])
            : [],
        isVerified: user.instructorProfile.isVerified,
        locations: ['El Zonte', 'El Tunco'], // Default locations for now since we don't have them in DB yet
    };

    // Prepare availability data
    const availability = availabilitySlots.map((slot) => ({
        id: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable,
        maxStudents: slot.maxStudents,
        currentBookings: slot.currentBookings,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
            <InstructorHeader instructor={instructor} />

            <Separator className="my-8 container" />

            <div className="container grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="mb-4 font-heading text-2xl font-bold text-primary">Sobre mí</h2>
                        <p className="text-muted-foreground whitespace-pre-line">
                            {instructor.bio || 'Este instructor aún no ha agregado una biografía.'}
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 font-heading text-2xl font-bold text-primary">Experiencia</h2>
                        <div className="rounded-lg border border-blue-100 bg-white shadow-sm p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Años de experiencia
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {instructor.experienceYears || 0} años
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
                        <h2 className="mb-4 font-heading text-xl font-bold text-primary">
                            Reservar Clase
                        </h2>
                        <BookingWidget slots={availability} instructor={instructor} />
                    </div>
                </div>
            </div>
        </div>
    );
}
