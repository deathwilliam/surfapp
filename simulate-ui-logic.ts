import { PrismaClient } from '@prisma/client';
import { startOfDay, isSameDay } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
    const instructorUserId = 'ffb74655-40f4-45a7-9d42-3808dd9f710a'; // Roberto Flores

    // 1. Simulating page.tsx fetch
    const user = await prisma.user.findUnique({
        where: { id: instructorUserId },
        include: { instructorProfile: true }
    });

    if (!user || !user.instructorProfile) {
        console.log('Instructor not found');
        return;
    }

    const availabilitySlots = await prisma.instructorAvailability.findMany({
        where: {
            instructorId: user.instructorProfile.id,
            date: {
                gte: startOfDay(new Date()),
            },
        },
        orderBy: { date: 'asc' },
        take: 30,
    });

    console.log(`Fetched ${availabilitySlots.length} slots from DB.`);

    // 2. Simulating AvailabilityCalendar.tsx logic
    const today = new Date();
    // Assuming the user selects the first available day (which is likely tomorrow since today's slots might be in the past hour-wise)
    // But let's check slots for Dec 22 (tomorrow) specifically
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 1);

    const dailySlots = availabilitySlots.filter(
        (slot) =>
            isSameDay(new Date(slot.date), targetDate) &&
            slot.isAvailable &&
            slot.currentBookings < slot.maxStudents &&
            (isSameDay(new Date(slot.date), today) || new Date(slot.date) > today)
    );

    console.log(`--- SIMULATION RESULTS for ${targetDate.toISOString().split('T')[0]} ---`);
    console.log(`Slots found: ${dailySlots.length}`);

    dailySlots.forEach(slot => {
        const d = new Date(slot.startTime);
        const h = d.getUTCHours().toString().padStart(2, '0');
        const m = d.getUTCMinutes().toString().padStart(2, '0');
        console.log(`Slot ID: ${slot.id} | Formatted Time: ${h}:${m}`);
    });

    // Check today specifically to see if it works now
    const todaySlots = availabilitySlots.filter(
        (slot) =>
            isSameDay(new Date(slot.date), today) &&
            slot.isAvailable &&
            slot.currentBookings < slot.maxStudents &&
            (isSameDay(new Date(slot.date), today) || new Date(slot.date) > today)
    );
    console.log(`\n--- SIMULATION RESULTS for TODAY (${today.toISOString().split('T')[0]}) ---`);
    console.log(`Slots found: ${todaySlots.length}`);

}

main().finally(() => prisma.$disconnect());
