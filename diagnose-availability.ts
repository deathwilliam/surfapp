import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const totalSlots = await prisma.instructorAvailability.count();
        const futureSlots = await prisma.instructorAvailability.count({
            where: {
                date: {
                    gte: new Date(),
                },
            },
        });

        const latestSlot = await prisma.instructorAvailability.findFirst({
            orderBy: {
                date: 'desc',
            },
        });

        console.log('--- DATABASE DIAGNOSIS ---');
        console.log('Total slots in DB:', totalSlots);
        console.log('Slots from today onwards:', futureSlots);
        console.log('Latest slot date:', latestSlot?.date);

        const firstFutureSlots = await prisma.instructorAvailability.findMany({
            where: {
                date: {
                    gte: new Date(),
                },
            },
            take: 5,
            orderBy: {
                date: 'asc'
            }
        });
        console.log('Sample future slots:', JSON.stringify(firstFutureSlots, null, 2));

    } catch (error) {
        console.error('Error during diagnosis:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
