import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function InstructorProfilePage({
    params,
}: {
    params: { id: string };
}) {
    try {
        // Simple query to test database connection
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
        });

        if (!user) {
            notFound();
        }

        return (
            <div className="container py-10">
                <h1 className="text-3xl font-bold">
                    Instructor: {user.firstName} {user.lastName}
                </h1>
                <p className="mt-4 text-muted-foreground">
                    ID: {user.id}
                </p>
                <p className="mt-2 text-sm text-green-600">
                    ✅ Database connection working!
                </p>
            </div>
        );
    } catch (error) {
        console.error('Error loading instructor:', error);
        return (
            <div className="container py-10">
                <h1 className="text-3xl font-bold text-red-600">Error</h1>
                <p className="mt-4">
                    Failed to load instructor profile. Error: {String(error)}
                </p>
            </div>
        );
    }
}
