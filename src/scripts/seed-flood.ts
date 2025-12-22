
import { PrismaClient } from '@prisma/client';
import { addDays, setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
    console.log('🌊 FLOODING slots for the next 48 hours...');

    const ana = await prisma.user.findFirst({
        where: { email: 'ana.waves@example.com' },
        include: { instructorProfile: true }
    });

    if (!ana || !ana.instructorProfile) throw new Error('Ana not found');
    const location = await prisma.location.findFirst();

    const today = new Date();

    // Create slots for every hour from 6am to 6pm for today and tomorrow
    for (let d = 0; d < 3; d++) {
        const day = addDays(today, d);
        for (let h = 6; h <= 18; h++) {
            const startTime = setMilliseconds(setSeconds(setMinutes(setHours(day, h), 0), 0), 0);
            const endTime = setMilliseconds(setSeconds(setMinutes(setHours(day, h + 1), 0), 0), 0);
            const dateOnly = setMilliseconds(setSeconds(setHours(day, 0), 0), 0);

            const existing = await prisma.instructorAvailability.findFirst({
                where: {
                    instructorId: ana.instructorProfile.id,
                    date: dateOnly,
                    startTime: startTime
                }
            });

            if (!existing) {
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
            } else {
                await prisma.instructorAvailability.update({
                    where: { id: existing.id },
                    data: { isAvailable: true, currentBookings: 0 }
                });
            }
        }
    }
    console.log('✅ Flooded slots.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
