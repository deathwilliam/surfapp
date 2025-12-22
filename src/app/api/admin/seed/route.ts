import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

// Only callable with correct seed key from env
const SEED_KEY = process.env.SEED_KEY || 'dev-key-change-in-production';

export async function POST(req: NextRequest) {
    try {
        // Check authorization
        const authHeader = req.headers.get('x-seed-key');
        if (authHeader !== SEED_KEY) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.log('🌊 Starting database seed via API...');

        // Clean existing data
        console.log('🧹 Cleaning existing data...');

        await prisma.notification.deleteMany();
        await prisma.message.deleteMany();
        await prisma.review.deleteMany();
        await prisma.payment.deleteMany();
        await prisma.booking.deleteMany();
        await prisma.instructorAvailability.deleteMany();
        await prisma.location.deleteMany();
        await prisma.instructorProfile.deleteMany();
        await prisma.user.deleteMany();

        // Create Locations
        console.log('📍 Creating surf locations...');
        const locations = await Promise.all([
            prisma.location.create({
                data: {
                    name: 'Playa El Tunco',
                    address: 'Carretera del Litoral km 42',
                    city: 'Tamanique',
                    state: 'La Libertad',
                    country: 'El Salvador',
                    latitude: 13.4928,
                    longitude: -89.3923,
                    description: 'Una de las playas más populares para surfear en El Salvador. Conocida por sus olas consistentes y ambiente relajado.',
                    imageUrl: '/images/locations/el-tunco.jpg',
                    isActive: true,
                },
            }),
            prisma.location.create({
                data: {
                    name: 'Playa El Sunzal',
                    address: 'Carretera del Litoral km 44',
                    city: 'Tamanique',
                    state: 'La Libertad',
                    country: 'El Salvador',
                    latitude: 13.4924,
                    longitude: -89.3919,
                    description: 'Playa con excelentes olas para surfistas intermedios. Ambiente familiar y seguro.',
                    imageUrl: '/images/locations/el-sunzal.jpg',
                    isActive: true,
                },
            }),
            prisma.location.create({
                data: {
                    name: 'Playa La Paz',
                    address: 'Carretera del Litoral km 46',
                    city: 'Tamanique',
                    state: 'La Libertad',
                    country: 'El Salvador',
                    latitude: 13.4920,
                    longitude: -89.3915,
                    description: 'Playa tranquila ideal para principiantes. Aguas calmadas y personal atento.',
                    imageUrl: '/images/locations/la-paz.jpg',
                    isActive: true,
                },
            }),
            prisma.location.create({
                data: {
                    name: 'Playa El Zonte',
                    address: 'Carretera del Litoral km 50',
                    city: 'Tamanique',
                    state: 'La Libertad',
                    country: 'El Salvador',
                    latitude: 13.4915,
                    longitude: -89.3910,
                    description: 'Playa remota con olas poderosas. Destino favorito para surfistas avanzados.',
                    imageUrl: '/images/locations/el-zonte.jpg',
                    isActive: true,
                },
            }),
            prisma.location.create({
                data: {
                    name: 'Playa Las Flores',
                    address: 'Carretera del Litoral km 52',
                    city: 'Tamanique',
                    state: 'La Libertad',
                    country: 'El Salvador',
                    latitude: 13.4910,
                    longitude: -89.3905,
                    description: 'Playa remota con olas poderosas. Destino favorito para surfistas experimentados.',
                    imageUrl: '/images/locations/las-flores.jpg',
                    isActive: true,
                },
            }),
        ]);

        console.log(`✅ Created ${locations.length} locations`);

        // Create Students
        console.log('👨‍🎓 Creating student users...');
        const students = await Promise.all([
            prisma.user.create({
                data: {
                    email: 'carlos.martinez@example.com',
                    passwordHash: await hashPassword('password123'),
                    firstName: 'Carlos',
                    lastName: 'Martínez',
                    phone: '+503 7123-4567',
                    userType: 'student',
                    emailVerified: new Date(),
                },
            }),
            prisma.user.create({
                data: {
                    email: 'maria.lopez@example.com',
                    passwordHash: await hashPassword('password123'),
                    firstName: 'María',
                    lastName: 'López',
                    phone: '+503 7234-5678',
                    userType: 'student',
                    emailVerified: new Date(),
                },
            }),
            prisma.user.create({
                data: {
                    email: 'jose.hernandez@example.com',
                    passwordHash: await hashPassword('password123'),
                    firstName: 'José',
                    lastName: 'Hernández',
                    phone: '+503 7345-6789',
                    userType: 'student',
                    emailVerified: new Date(),
                },
            }),
        ]);

        console.log(`✅ Created ${students.length} students`);

        // Create Instructors
        console.log('🏄 Creating instructor users...');
        const instructor1 = await prisma.user.create({
            data: {
                email: 'roberto.surf@example.com',
                passwordHash: await hashPassword('password123'),
                firstName: 'Roberto',
                lastName: 'Flores',
                phone: '+503 7456-7890',
                userType: 'instructor',
                emailVerified: new Date(),
                instructorProfile: {
                    create: {
                        bio: 'Instructor de surf certificado con más de 10 años de experiencia. Especializado en enseñar a principiantes y técnicas avanzadas de surf.',
                        experienceYears: 10,
                        certifications: [
                            'ISA Level 2 Surf Instructor',
                            'Lifeguard Certification',
                            'First Aid & CPR',
                        ],
                        specialties: ['Principiantes', 'Surf de olas grandes', 'Técnica avanzada'],
                        hourlyRate: 25.0,
                        isVerified: true,
                        averageRating: 4.8,
                        totalReviews: 47,
                        totalClasses: 156,
                    },
                },
            },
        });

        const instructor2 = await prisma.user.create({
            data: {
                email: 'ana.waves@example.com',
                passwordHash: await hashPassword('password123'),
                firstName: 'Ana',
                lastName: 'Ramírez',
                phone: '+503 7567-8901',
                userType: 'instructor',
                emailVerified: new Date(),
                instructorProfile: {
                    create: {
                        bio: 'Surfista profesional y instructora apasionada. Me encanta compartir el amor por el surf con personas de todas las edades.',
                        experienceYears: 7,
                        certifications: ['ISA Level 1 Surf Instructor', 'Yoga Instructor', 'First Aid'],
                        specialties: ['Principiantes', 'Mujeres surfistas', 'Surf fitness'],
                        hourlyRate: 20.0,
                        isVerified: true,
                        averageRating: 4.9,
                        totalReviews: 63,
                        totalClasses: 198,
                    },
                },
            },
        });

        const instructor3 = await prisma.user.create({
            data: {
                email: 'diego.ocean@example.com',
                passwordHash: await hashPassword('password123'),
                firstName: 'Diego',
                lastName: 'Morales',
                phone: '+503 7678-9012',
                userType: 'instructor',
                emailVerified: new Date(),
                instructorProfile: {
                    create: {
                        bio: 'Ex-competidor de surf ahora dedicado a la enseñanza. Enfocado en técnicas de competición y surf de alto rendimiento.',
                        experienceYears: 12,
                        certifications: [
                            'ISA Level 3 Surf Instructor',
                            'Surf Coach Certification',
                            'Ocean Safety',
                        ],
                        specialties: ['Competición', 'Surf avanzado', 'Análisis de video'],
                        hourlyRate: 35.0,
                        isVerified: true,
                        averageRating: 4.7,
                        totalReviews: 34,
                        totalClasses: 89,
                    },
                },
            },
        });

        const instructor4 = await prisma.user.create({
            data: {
                email: 'lucia.beach@example.com',
                passwordHash: await hashPassword('password123'),
                firstName: 'Lucía',
                lastName: 'Castro',
                phone: '+503 7789-0123',
                userType: 'instructor',
                emailVerified: new Date(),
                instructorProfile: {
                    create: {
                        bio: 'Instructora especializada en niños y familias. Creo un ambiente seguro y divertido para aprender surf.',
                        experienceYears: 5,
                        certifications: ['ISA Level 1 Surf Instructor', 'Child Safety', 'First Aid'],
                        specialties: ['Niños', 'Familias', 'Principiantes'],
                        hourlyRate: 18.0,
                        isVerified: true,
                        averageRating: 5.0,
                        totalReviews: 52,
                        totalClasses: 124,
                    },
                },
            },
        });

        console.log('✅ Created 4 instructors with profiles');

        // Get instructor profiles
        const instructorProfiles = await prisma.instructorProfile.findMany({
            include: { user: true },
        });

        // Create Availability for Instructors
        console.log('📅 Creating instructor availability...');
        const today = new Date();
        const availabilities = [];

        for (const instructor of instructorProfiles) {
            // Create availability for the next 14 days
            for (let day = 0; day < 14; day++) {
                const date = new Date(today);
                date.setDate(date.getDate() + day);

                // Skip Sundays
                if (date.getDay() === 0) continue;

                // Morning slot (8:00 - 10:00)
                availabilities.push(
                    prisma.instructorAvailability.create({
                        data: {
                            instructorId: instructor.id,
                            locationId: locations[Math.floor(Math.random() * locations.length)].id,
                            date: date,
                            startTime: new Date('1970-01-01T08:00:00Z'),
                            endTime: new Date('1970-01-01T10:00:00Z'),
                            isAvailable: true,
                            maxStudents: 3,
                            currentBookings: 0,
                        },
                    })
                );

                // Afternoon slot (14:00 - 16:00)
                availabilities.push(
                    prisma.instructorAvailability.create({
                        data: {
                            instructorId: instructor.id,
                            locationId: locations[Math.floor(Math.random() * locations.length)].id,
                            date: date,
                            startTime: new Date('1970-01-01T14:00:00Z'),
                            endTime: new Date('1970-01-01T16:00:00Z'),
                            isAvailable: true,
                            maxStudents: 3,
                            currentBookings: 0,
                        },
                    })
                );

                // Evening slot (16:30 - 18:30) - only on weekends
                if (date.getDay() === 6 || date.getDay() === 0) {
                    availabilities.push(
                        prisma.instructorAvailability.create({
                            data: {
                                instructorId: instructor.id,
                                locationId: locations[Math.floor(Math.random() * locations.length)].id,
                                date: date,
                                startTime: new Date('1970-01-01T16:30:00Z'),
                                endTime: new Date('1970-01-01T18:30:00Z'),
                                isAvailable: true,
                                maxStudents: 4,
                                currentBookings: 0,
                            },
                        })
                    );
                }
            }
        }

        await Promise.all(availabilities);
        console.log(`✅ Created ${availabilities.length} availability slots`);

        // Create Admin User
        console.log('👑 Creating admin user...');
        await prisma.user.create({
            data: {
                email: 'admin@surfapp.com',
                passwordHash: await hashPassword('admin123'),
                firstName: 'Admin',
                lastName: 'User',
                phone: '+503 7000-0000',
                userType: 'admin',
                emailVerified: new Date(),
            },
        });

        console.log('✅ Created admin user');

        console.log('\n🎉 Database seeded successfully!');

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            stats: {
                locations: locations.length,
                students: students.length,
                instructors: 4,
                availabilities: availabilities.length,
                admin: 1,
            },
        });
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        return NextResponse.json(
            {
                error: 'Failed to seed database',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
