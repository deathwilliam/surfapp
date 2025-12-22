
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.user.count();
        console.log(`Successfully connected. User count: ${count}`);
        const locations = await prisma.location.findMany({ take: 1 });
        console.log(`Locations found: ${locations.length}`);
    } catch (e) {
        console.error('DB Connection Failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
