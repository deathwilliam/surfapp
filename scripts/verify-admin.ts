import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function verifyAdminUser() {
    console.log('🔍 Verifying admin user...\n');

    const admin = await prisma.user.findUnique({
        where: { email: 'admin@surfapp.com' },
    });

    if (!admin) {
        console.log('❌ Admin user not found in database');
        return;
    }

    console.log('✅ Admin user found:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.firstName} ${admin.lastName}`);
    console.log(`   User Type: ${admin.userType}`);
    console.log(`   Email Verified: ${admin.emailVerified ? 'Yes' : 'No'}`);
    console.log(`   Password Hash: ${admin.passwordHash?.substring(0, 20)}...`);

    // Test password verification
    if (admin.passwordHash) {
        const testPassword = 'admin123';
        const isValid = await bcrypt.compare(testPassword, admin.passwordHash);
        console.log(`\n🔐 Password verification test:`);
        console.log(`   Testing password: "${testPassword}"`);
        console.log(`   Result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    }

    await prisma.$disconnect();
}

verifyAdminUser().catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
});
