import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { BookingList } from '@/components/instructor/BookingList';
import { Separator } from '@/components/ui/separator';

export default async function BookingsPage() {
    const session = await auth();

    if (!session || !session.user || session.user.userType !== 'instructor') {
        redirect('/login');
    }

    // First, get the instructor profile ID
    const instructorProfile = await prisma.instructorProfile.findUnique({
        where: {
            userId: session.user.id,
        },
        select: {
            id: true,
        },
    });

    if (!instructorProfile) {
        redirect('/login');
    }

    const bookings = await prisma.booking.findMany({
        where: {
            instructorId: instructorProfile.id,
        },
        include: {
            student: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            location: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            startTime: 'desc',
        },
    });

    // Transform dates to JS Date objects (Prisma returns them as Date objects, but for client component props it's safer to be explicit or they are passed as is)
    // Next.js server components pass Date objects fine to client components now.

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Gestión de Reservas</h3>
                <p className="text-sm text-muted-foreground">
                    Revisa y gestiona las solicitudes de reserva de tus estudiantes.
                </p>
            </div>
            <Separator />
            <BookingList bookings={bookings} />
        </div>
    );
}
