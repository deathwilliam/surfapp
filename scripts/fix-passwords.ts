import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Fixing passwords...');

    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const emails = [
        'carlos.martinez@example.com',
        'roberto.surf@example.com'
    ];

    for (const email of emails) {
        const user = await prisma.user.update({
            where: { email },
            data: { passwordHash: hashedPassword },
        });
        console.log(`✅ Updated password for ${user.email}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
