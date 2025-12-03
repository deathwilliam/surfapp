import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import EditLocationClient from './client';

interface EditLocationPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditLocationPage({ params }: EditLocationPageProps) {
    const session = await auth();
    if (session?.user?.userType !== 'admin') {
        redirect('/dashboard');
    }

    const { id } = await params;
    const location = await prisma.location.findUnique({
        where: { id },
    });

    if (!location) {
        notFound();
    }

    return <EditLocationClient location={location} />;
}
