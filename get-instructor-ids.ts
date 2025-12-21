import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const instructors = await prisma.user.findMany({
            where: { userType: 'instructor' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                instructorProfile: {
                    select: {
                        id: true
                    }
                }
            }
        });

        console.log('--- INSTRUCTORS ---');
        instructors.forEach(i => {
            console.log(`${i.firstName} ${i.lastName} | User.id: ${i.id} | Profile.id: ${i.instructorProfile?.id}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
