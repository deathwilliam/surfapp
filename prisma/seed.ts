import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

// Hash passwords using bcrypt (same as production)
async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
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
                name: 'Punta Roca',
                address: 'Calle Principal',
                city: 'La Libertad',
                state: 'La Libertad',
                country: 'El Salvador',
                latitude: 13.4889,
                longitude: -89.3206,
                description: 'La mejor ola de El Salvador. Point break rápido y hueco, considerado uno de los mejores de Centroamérica.',
                imageUrl: '/images/beaches/punta-roca.png',
                difficulty: 'Experto',
                surfType: 'Right-hand point break',
                isActive: true,
            },
        }),
        prisma.location.create({
            data: {
                name: 'El Sunzal',
                address: 'Carretera del Litoral km 44',
                city: 'El Tunco',
                state: 'La Libertad',
                country: 'El Salvador',
                latitude: 13.4956,
                longitude: -89.4012,
                description: 'Olas largas y consistentes. Perfecto para todos los niveles, desde principiantes hasta expertos.',
                imageUrl: '/images/beaches/el-sunzal.png',
                difficulty: 'Todos',
                surfType: 'Right-hand point break',
                isActive: true,
            },
        }),
        prisma.location.create({
            data: {
                name: 'Las Flores',
                address: 'Carretera a El Cuco',
                city: 'El Cuco',
                state: 'San Miguel',
                country: 'El Salvador',
                latitude: 13.3012,
                longitude: -88.2123,
                description: 'Hermosa playa con olas largas y rápidas. Point break muy consistente con tubos impresionantes.',
                imageUrl: '/images/beaches/las-flores.png',
                difficulty: 'Intermedio',
                surfType: 'Right-point break',
                isActive: true,
            },
        }),
        prisma.location.create({
            data: {
                name: 'El Zonte',
                address: 'Carretera del Litoral km 53',
                city: 'Chiltiupán',
                state: 'La Libertad',
                country: 'El Salvador',
                latitude: 13.5012,
                longitude: -89.4523,
                description: 'Ambiente bohemio con olas de calidad. Dos spots principales con derechas largas y potentes.',
                imageUrl: '/images/beaches/el-zonte.png',
                difficulty: 'Intermedio',
                surfType: 'Right & left waves',
                isActive: true,
            },
        }),
        prisma.location.create({
            data: {
                name: 'Punta Mango',
                address: 'Costa del Oriente',
                city: 'Intipucá',
                state: 'La Unión',
                country: 'El Salvador',
                latitude: 13.2890,
                longitude: -88.1890,
                description: 'Una de las olas más exigentes. Tubos rápidos y potentes, solo para surfistas experimentados.',
                imageUrl: '/images/beaches/punta-mango.png',
                difficulty: 'Experto',
                surfType: 'Right-point break',
                isActive: true,
            },
        }),
        prisma.location.create({
            data: {
                name: 'Mizata',
                address: 'Carretera del Litoral km 86',
                city: 'Teotepeque',
                state: 'La Libertad',
                country: 'El Salvador',
                latitude: 13.5234,
                longitude: -89.6123,
                description: 'Point break clásico y beach break de calidad. Variedad de olas que garantizan buenas sesiones.',
                imageUrl: '/images/beaches/mizata.png',
                difficulty: 'Todos',
                surfType: 'Point & beach break',
                isActive: true,
            },
        }),
        prisma.location.create({
            data: {
                name: 'K59',
                address: 'Carretera del Litoral km 59',
                city: 'Costa del Sol',
                state: 'La Libertad',
                country: 'El Salvador',
                latitude: 13.5123,
                longitude: -89.5123,
                description: 'Ola subestimada con forma consistente. Hermosa cala con point break sobre piedras.',
                imageUrl: '/images/beaches/k59.png',
                difficulty: 'Intermedio',
                surfType: 'Right-hand point',
                isActive: true,
            },
        }),
        prisma.location.create({
            data: {
                name: 'La Bocana',
                address: 'Malecón de La Libertad',
                city: 'Puerto de La Libertad',
                state: 'La Libertad',
                country: 'El Salvador',
                latitude: 13.4856,
                longitude: -89.3189,
                description: 'Beach break versátil y consistente. Una de las pocas izquierdas de El Salvador.',
                imageUrl: '/images/beaches/la-bocana.png',
                difficulty: 'Todos',
                surfType: 'Beach break - lefts',
                isActive: true,
            },
        }),
        prisma.location.create({
            data: {
                name: 'El Tunco',
                address: 'Carretera del Litoral km 42',
                city: 'Chiltiupán',
                state: 'La Libertad',
                country: 'El Salvador',
                latitude: 13.4928,
                longitude: -89.3923,
                description: 'Icónica formación rocosa. Ambiente festivo con olas ideales para aprender y mejorar.',
                imageUrl: '/images/beaches/el-tunco.png',
                difficulty: 'Principiante',
                surfType: 'Beach break',
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

    const instructor5 = await prisma.user.create({
        data: {
            email: 'mario.zen@example.com',
            passwordHash: await hashPassword('password123'),
            firstName: 'Mario',
            lastName: 'Sánchez',
            phone: '+503 7890-1234',
            userType: 'instructor',
            emailVerified: new Date(),
            instructorProfile: {
                create: {
                    bio: 'Especialista en Yoga & Surf. Mis clases combinan técnicas de respiración, flexibilidad y mindfulness para mejorar tu surfing.',
                    experienceYears: 8,
                    certifications: ['ISA Level 2 Surf Instructor', 'Certified Yoga Alliance Teacher', 'CPR'],
                    specialties: ['Yoga Surf', 'Mindfulness', 'Flexibilidad'],
                    hourlyRate: 30.0,
                    isVerified: true,
                    averageRating: 4.9,
                    totalReviews: 28,
                    totalClasses: 110,
                },
            },
        },
    });

    const instructor6 = await prisma.user.create({
        data: {
            email: 'sofia.longboard@example.com',
            passwordHash: await hashPassword('password123'),
            firstName: 'Sofía',
            lastName: 'Vega',
            phone: '+503 7901-2345',
            userType: 'instructor',
            emailVerified: new Date(),
            instructorProfile: {
                create: {
                    bio: 'Amante del estilo clásico. Te enseño a caminar sobre la tabla, Hang Five y el arte del Longboard.',
                    experienceYears: 6,
                    certifications: ['ISA Level 1 Surf Instructor', 'Longboard Specialty', 'First Aid'],
                    specialties: ['Longboard', 'Estilo Clásico', 'Bailar sobre la tabla'],
                    hourlyRate: 22.0,
                    isVerified: true,
                    averageRating: 4.8,
                    totalReviews: 45,
                    totalClasses: 135,
                },
            },
        },
    });

    console.log('✅ Created 6 instructors with profiles');

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
    console.log('  • mario.zen@example.com / password123');
    console.log('  • sofia.longboard@example.com / password123');
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
