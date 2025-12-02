import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AvailabilityManager } from '@/components/instructor/AvailabilityManager';
import { Separator } from '@/components/ui/separator';
import prisma from '@/lib/prisma';

export default async function AvailabilityPage() {
    const session = await auth();

    if (!session || !session.user || session.user.userType !== 'instructor') {
        redirect('/login');
    }

    const locations = await prisma.location.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
    });

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-primary">Gestión de Disponibilidad</h3>
                <p className="text-sm text-muted-foreground">
                    Configura los horarios en los que estás disponible para dar clases.
                </p>
            </div>
            <Separator className="bg-blue-100" />
            <AvailabilityManager locations={locations} />
        </div>
    );
}
