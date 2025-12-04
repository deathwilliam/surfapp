
import { PrismaClient, BookingStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Finding student...');
  const student = await prisma.user.findFirst({
    where: { email: 'carlos.martinez@example.com' },
  });

  if (!student) {
    console.error('❌ Student not found. Did you run the seed?');
    return;
  }
  console.log(`✅ Found student: ${student.firstName} ${student.lastName} (${student.id})`);

  console.log('🔍 Finding available slot...');
  const availability = await prisma.instructorAvailability.findFirst({
    where: {
      isAvailable: true,
      currentBookings: { lt: 3 }, // Assuming maxStudents is 3 or more
    },
    include: {
      instructor: {
        include: {
          user: true,
        },
      },
      location: true,
    },
  });

  if (!availability) {
    console.error('❌ No available slots found.');
    return;
  }
  console.log(`✅ Found slot: ${availability.date.toDateString()} with ${availability.instructor.user.firstName} at ${availability.location.name}`);

  console.log('📝 Creating booking...');
  const booking = await prisma.booking.create({
    data: {
      studentId: student.id,
      instructorId: availability.instructorId,
      availabilityId: availability.id,
      locationId: availability.locationId,
      bookingDate: availability.date,
      startTime: availability.startTime,
      endTime: availability.endTime,
      status: BookingStatus.confirmed,
      price: availability.instructor.hourlyRate * 2, // Assuming 2 hours
      payment: {
        create: {
          amount: availability.instructor.hourlyRate * 2,
          platformFee: 5.00,
          instructorAmount: (availability.instructor.hourlyRate * 2) - 5.00,
          currency: 'USD',
          status: PaymentStatus.succeeded,
          stripePaymentIntentId: 'pi_mock_123456',
        },
      },
    },
  });

  // Update availability count
  await prisma.instructorAvailability.update({
    where: { id: availability.id },
    data: {
      currentBookings: { increment: 1 },
    },
  });

  console.log(`✅ Booking created! ID: ${booking.id}`);
  console.log(`👉 Log in as carlos.martinez@example.com to see it.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
