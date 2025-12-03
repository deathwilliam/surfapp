'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { LocationFormData } from '@/components/admin/LocationForm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createLocation(data: LocationFormData) {
    const session = await auth();
    if (session?.user?.userType !== 'admin') {
        throw new Error('Unauthorized');
    }

    await prisma.location.create({
        data: {
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            description: data.description,
            imageUrl: data.imageUrl,
            isActive: data.isActive,
        },
    });

    revalidatePath('/dashboard/admin/locations');
    redirect('/dashboard/admin/locations');
}

export async function updateLocation(id: string, data: LocationFormData) {
    const session = await auth();
    if (session?.user?.userType !== 'admin') {
        throw new Error('Unauthorized');
    }

    await prisma.location.update({
        where: { id },
        data: {
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            description: data.description,
            imageUrl: data.imageUrl,
            isActive: data.isActive,
        },
    });

    revalidatePath('/dashboard/admin/locations');
    revalidatePath(`/dashboard/admin/locations/${id}`);
    redirect('/dashboard/admin/locations');
}

export async function deleteLocation(id: string) {
    const session = await auth();
    if (session?.user?.userType !== 'admin') {
        throw new Error('Unauthorized');
    }

    // Check if location has dependencies (bookings, availability)
    // For now, we'll just deactivate it if it has dependencies, or delete if not.
    // Or simpler: just delete and let cascade handle it if configured, or fail.
    // Given the schema, let's just delete. If it fails due to FK, we should handle it in UI.
    // But for safety, let's just delete.

    try {
        await prisma.location.delete({
            where: { id },
        });
    } catch (error) {
        console.error("Error deleting location:", error);
        throw new Error("No se puede eliminar la ubicación porque tiene registros asociados.");
    }

    revalidatePath('/dashboard/admin/locations');
}
