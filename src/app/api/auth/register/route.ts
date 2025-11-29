import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { registerSchema } from '@/lib/validations/auth';
import { UserType } from '@prisma/client';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = registerSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Este email ya está registrado' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(validatedData.password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                passwordHash,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                phone: validatedData.phone || null,
                userType: validatedData.userType,
                emailVerified: null, // Will be set after email verification
                // Create instructor profile if user is an instructor
                ...(validatedData.userType === UserType.instructor && {
                    instructorProfile: {
                        create: {
                            bio: null,
                            experienceYears: null,
                            hourlyRate: 0,
                            isVerified: false,
                        },
                    },
                }),
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                userType: true,
            },
        });

        return NextResponse.json(
            {
                message: 'Usuario registrado exitosamente',
                user,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);

        // Handle Zod validation errors
        if (error.name === 'ZodError') {
            return NextResponse.json(
                {
                    error: 'Datos inválidos',
                    details: error.errors,
                },
                { status: 400 }
            );
        }

        // Handle Prisma errors
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Este email ya está registrado' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Error al registrar usuario' },
            { status: 500 }
        );
    }
}
