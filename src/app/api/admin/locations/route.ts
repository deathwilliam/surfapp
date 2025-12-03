import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { UserType } from '@prisma/client';

// GET: List all locations
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user || session.user.userType !== UserType.admin) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const locations = await prisma.location.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { availabilities: true },
                },
            },
        });

        return NextResponse.json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        return NextResponse.json(
            { error: 'Error al obtener ubicaciones' },
            { status: 500 }
        );
    }
}

// POST: Create a new location
export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user || session.user.userType !== UserType.admin) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await req.json();
        const { name, address, city, state, country, latitude, longitude, imageUrl, description } = body;

        if (!name || !city || !country || !latitude || !longitude) {
            return NextResponse.json(
                { error: 'Nombre, ciudad, país, latitud y longitud son requeridos' },
                { status: 400 }
            );
        }

        const location = await prisma.location.create({
            data: {
                name,
                address: address || '',
                city,
                state: state || null,
                country,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                imageUrl,
                description,
            },
        });

        return NextResponse.json(location, { status: 201 });
    } catch (error) {
        console.error('Error creating location:', error);
        return NextResponse.json(
            { error: 'Error al crear ubicación' },
            { status: 500 }
        );
    }
}
