import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/instructor/ProfileForm';
import { Separator } from '@/components/ui/separator';

export default async function InstructorProfilePage() {
    const session = await auth();

    if (!session || !session.user || session.user.userType !== 'instructor') {
        redirect('/login');
    }

    const instructor = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            instructorProfile: true,
        },
    });

    if (!instructor || !instructor.instructorProfile) {
        return <div>Error al cargar el perfil</div>;
    }

    const locations = await prisma.location.findMany({
        select: { id: true, name: true },
    });

    const initialData = {
        bio: instructor.instructorProfile.bio || '',
        experienceYears: instructor.instructorProfile.experienceYears || 0,
        hourlyRate: instructor.instructorProfile.hourlyRate ? Number(instructor.instructorProfile.hourlyRate) : 0,
        specialties: Array.isArray(instructor.instructorProfile.specialties) ? (instructor.instructorProfile.specialties as string[]) : [],
        locations: [], // Locations are managed through availability, not profile
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Perfil de Instructor</h3>
                <p className="text-sm text-muted-foreground">
                    Actualiza tu información pública. Las ubicaciones se configuran al crear horarios disponibles.
                </p>
            </div>
            <Separator />
            <ProfileForm initialData={initialData} availableLocations={locations} />
        </div>
    );
}

