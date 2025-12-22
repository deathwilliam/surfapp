
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔔 Seeding a test notification for Ana...');

    const ana = await prisma.user.findFirst({
        where: { email: 'ana.waves@example.com' }
    });

    if (!ana) throw new Error('Ana not found');

    await prisma.notification.create({
        data: {
            userId: ana.id,
            type: 'booking_update',
            title: 'Prueba de Notificación Manual',
            message: 'Esta es una notificación de prueba para verificar que el sistema funciona. Razón included.',
            isRead: false,
        }
    });

    console.log('✅ Notification created for User ID:', ana.id);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
