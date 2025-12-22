import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: 'diego.morales@example.com'
            },
            include: {
                instructorProfile: true
            }
        });

        if (user) {
            console.log('✅ User found:');
            console.log('Name:', user.firstName, user.lastName);
            console.log('Email:', user.email);
            console.log('Type:', user.userType);
            console.log('Created:', user.createdAt);
            if (user.instructorProfile) {
                console.log('Instructor Profile:', {
                    hourlyRate: user.instructorProfile.hourlyRate,
                    experienceYears: user.instructorProfile.experienceYears,
                    isVerified: user.instructorProfile.isVerified
                });
            }
        } else {
            console.log('❌ User NOT found with email: diego.morales@example.com');
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
