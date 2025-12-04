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
    const location = await prisma.location.findUnique({
        where: { id },
        include: {
            _count: {
                select: { availabilities: true, bookings: true },
            },
        },
    });

    if (!location) {
        throw new Error('Location not found');
    }

    try {
        if (location._count.availabilities > 0 || location._count.bookings > 0) {
            // Soft delete: Mark as inactive if there are dependencies
            await prisma.location.update({
                where: { id },
                data: { isActive: false },
            });
        } else {
            // Hard delete: Remove if no dependencies
            await prisma.location.delete({
                where: { id },
            });
        }
    } catch (error) {
        console.error("Error deleting/updating location:", error);
        throw new Error("Error al procesar la ubicación.");
    }

    revalidatePath('/dashboard/admin/locations');
}
