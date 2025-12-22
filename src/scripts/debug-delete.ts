import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userEmail = 'carlos.martinez@example.com';
    const user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
        console.error('User not found');
        return;
    }

    console.log(`User ID: ${user.id}`);

    // Check count before
    const countBefore = await prisma.message.count({
        where: {
            OR: [
                { senderId: user.id },
                { receiverId: user.id },
            ],
        },
    });
    console.log(`Messages before: ${countBefore}`);

    if (countBefore === 0) {
        console.log('No messages to delete.');
        // Let's create one?
    } else {
        // Simulate "Clear All" logic
        const deleted = await prisma.message.deleteMany({
            where: {
                OR: [
                    { senderId: user.id },
                    { receiverId: user.id },
                ],
            },
        });
        console.log(`Deleted result count: ${deleted.count}`);
    }

    // Check count after
    const countAfter = await prisma.message.count({
        where: {
            OR: [
                { senderId: user.id },
                { receiverId: user.id },
            ],
        },
    });
    console.log(`Messages after: ${countAfter}`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
