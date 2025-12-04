
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verifying bookings for Carlos...');
  const student = await prisma.user.findFirst({
    where: { email: 'carlos.martinez@example.com' },
  });

  if (!student) {
    console.error('❌ Student not found');
    return;
  }

  const bookings = await prisma.booking.findMany({
    where: { studentId: student.id },
    include: {
      instructor: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      location: {
        select: {
          name: true,
          city: true,
        },
      },
    },
    orderBy: {
      bookingDate: 'desc',
    },
  });

  console.log(`✅ Found ${bookings.length} bookings for ${student.firstName}:`);
  bookings.forEach(b => {
    console.log(`- [${b.status}] ${b.bookingDate.toDateString()} @ ${b.location.name} with ${b.instructor.user.firstName}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
