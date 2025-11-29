import { PrismaClient, UserType, StudentLevel } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Helper function to hash passwords (simple hash for demo purposes)
// In production, use bcrypt or argon2
function hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
}

async function main() {
    console.log('🌊 Starting database seed...');

    // Clean existing data (in development)
    console.log('🧹 Cleaning existing data...');
    await prisma.auditLog.deleteMany();
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
                description:
                    'Una de las playas más populares para surfear en El Salvador. Conocida por sus olas consistentes y ambiente relajado.',
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
                latitude: 13.4956,
                longitude: -89.4012,
                description:
                    'Famosa por su point break de clase mundial. Ideal para surfistas intermedios y avanzados.',
                imageUrl: '/images/locations/el-sunzal.jpg',
                isActive: true,
            },
        }),
        prisma.location.create({
            data: {
                name: 'Playa La Paz',
                address: 'Carretera del Litoral km 39',
                city: 'La Libertad',
                state: 'La Libertad',
                country: 'El Salvador',
                latitude: 13.4889,
                longitude: -89.3345,
                description:
                    'Playa tranquila perfecta para principiantes. Olas suaves y ambiente familiar.',
                imageUrl: '/images/locations/la-paz.jpg',
                isActive: true,
            },
        }),
        prisma.location.create({
            data: {
                name: 'Playa El Zonte',
                address: 'Carretera del Litoral km 53',
                city: 'Chiltiupán',
                state: 'La Libertad',
                country: 'El Salvador',
                latitude: 13.5012,
                longitude: -89.4523,
                description:
                    'Comunidad surfista vibrante con olas para todos los niveles. Conocida como "Bitcoin Beach".',
                imageUrl: '/images/locations/el-zonte.jpg',
                isActive: true,
            },
        }),
        prisma.location.create({
            data: {
                name: 'Playa Las Flores',
                address: 'Carretera del Litoral',
                city: 'San Miguel',
                state: 'San Miguel',
                country: 'El Salvador',
                latitude: 13.3167,
                longitude: -88.2333,
                description:
                    'Playa remota con olas poderosas. Destino favorito para surfistas experimentados.',
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
                passwordHash: hashPassword('password123'),
                firstName: 'Carlos',
                lastName: 'Martínez',
                phone: '+503 7123-4567',
                userType: UserType.student,
                emailVerified: new Date(),
            },
        }),
        prisma.user.create({
            data: {
                email: 'maria.lopez@example.com',
                passwordHash: hashPassword('password123'),
                firstName: 'María',
                lastName: 'López',
                phone: '+503 7234-5678',
                userType: UserType.student,
                emailVerified: new Date(),
            },
        }),
        prisma.user.create({
            data: {
                email: 'jose.hernandez@example.com',
                passwordHash: hashPassword('password123'),
                firstName: 'José',
                lastName: 'Hernández',
                phone: '+503 7345-6789',
                userType: UserType.student,
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
            passwordHash: hashPassword('password123'),
            firstName: 'Roberto',
            lastName: 'Flores',
            phone: '+503 7456-7890',
            userType: UserType.instructor,
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
            passwordHash: hashPassword('password123'),
            firstName: 'Ana',
            lastName: 'Ramírez',
            phone: '+503 7567-8901',
            userType: UserType.instructor,
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
            passwordHash: hashPassword('password123'),
            firstName: 'Diego',
            lastName: 'Morales',
            phone: '+503 7678-9012',
            userType: UserType.instructor,
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
            passwordHash: hashPassword('password123'),
            firstName: 'Lucía',
            lastName: 'Castro',
            phone: '+503 7789-0123',
            userType: UserType.instructor,
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
            passwordHash: hashPassword('admin123'),
            firstName: 'Admin',
            lastName: 'User',
            phone: '+503 7000-0000',
            userType: UserType.admin,
            emailVerified: new Date(),
        },
    });

    console.log('✅ Created admin user');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👨‍🎓 Students:');
    console.log('  • carlos.martinez@example.com / password123');
    console.log('  • maria.lopez@example.com / password123');
    console.log('  • jose.hernandez@example.com / password123');
    console.log('\n🏄 Instructors:');
    console.log('  • roberto.surf@example.com / password123');
    console.log('  • ana.waves@example.com / password123');
    console.log('  • diego.ocean@example.com / password123');
    console.log('  • lucia.beach@example.com / password123');
    console.log('\n👑 Admin:');
    console.log('  • admin@surfapp.com / admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
