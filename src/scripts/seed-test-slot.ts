
import { PrismaClient } from '@prisma/client';
import { addDays, setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding slots for the entire week...');

    const ana = await prisma.user.findFirst({
        where: { email: 'ana.waves@example.com' },
        include: { instructorProfile: true }
    });

    if (!ana || !ana.instructorProfile) throw new Error('Ana not found');
    const location = await prisma.location.findFirst();

    // Create slots for the next 7 days at 10am and 2pm
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const day = addDays(today, i);

        // Times: 10:00 and 14:00
        const times = [10, 14];

        for (const hour of times) {
            const startTime = setMilliseconds(setSeconds(setMinutes(setHours(day, hour), 0), 0), 0);
            const endTime = setMilliseconds(setSeconds(setMinutes(setHours(day, hour + 2), 0), 0), 0);
            // Only date part for the 'date' field if your schema uses it for filtering
            const dateOnly = setMilliseconds(setSeconds(setHours(day, 0), 0), 0);

            const existing = await prisma.instructorAvailability.findFirst({
                where: {
                    instructorId: ana.instructorProfile.id,
                    date: dateOnly,
                    startTime: startTime
                }
            });

            if (existing) {
                await prisma.instructorAvailability.update({
                    where: { id: existing.id },
                    data: { isAvailable: true, currentBookings: 0, maxStudents: 5 }
                });
            } else {
                await prisma.instructorAvailability.create({
                    data: {
                        instructorId: ana.instructorProfile.id,
                        locationId: location?.id,
                        date: dateOnly,
                        startTime: startTime,
                        endTime: endTime,
                        isAvailable: true,
                        maxStudents: 5,
                        currentBookings: 0
                    }
                });
            }
        }
    }
    console.log('✅ Created/Updated slots for next 7 days.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
