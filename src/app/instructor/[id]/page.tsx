import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function InstructorProfilePage({ params }: PageProps) {
    try {
        // Await params in Next.js 15+
        const { id } = await params;

        // Simple query to test database connection
        const user = await prisma.user.findUnique({
            where: { id },
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
