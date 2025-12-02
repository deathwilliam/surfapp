import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import { ReviewModal } from '@/components/reviews/ReviewModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BookingStatus } from '@prisma/client';
import { CancelBookingButton } from '@/components/booking/CancelBookingButton';

async function getStudentBookings(userId: string) {
    const bookings = await prisma.booking.findMany({
        where: { studentId: userId },
        include: {
            instructor: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            profileImageUrl: true,
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
            review: {
                select: {
                    id: true,
                },
            },
        },
        orderBy: {
            bookingDate: 'desc',
        },
    });

    return bookings;
}

export default async function StudentBookingsPage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect('/login');
    }

    const bookings = await getStudentBookings(session.user.id);

    const upcomingBookings = bookings.filter(
        (b) => new Date(b.bookingDate) >= new Date() && b.status !== BookingStatus.cancelled
    );
    const pastBookings = bookings.filter(
        (b) => new Date(b.bookingDate) < new Date() || b.status === BookingStatus.cancelled
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 py-12 text-white">
                <div className="container">
                    <h1 className="font-heading text-4xl font-bold md:text-5xl">Mis Reservas</h1>
                    <p className="mt-3 text-lg text-blue-50">
                        Gestiona tus clases de surf
                    </p>
                </div>
            </div>

            <div className="container py-10">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold">Mis Reservas</h1>
                    <p className="text-muted-foreground">Gestiona tus clases de surf</p>
                </div>

                {/* Upcoming Bookings */}
                <div className="mb-10">
                    <h2 className="mb-4 font-heading text-2xl font-bold">Próximas Clases</h2>
                    {upcomingBookings.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {upcomingBookings.map((booking) => (
                                <Card key={booking.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {booking.instructor.user.firstName}{' '}
                                                    {booking.instructor.user.lastName}
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    Instructor de Surf
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    booking.status === BookingStatus.confirmed
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {booking.status === BookingStatus.confirmed
                                                    ? 'Confirmada'
                                                    : booking.status === BookingStatus.pending
                                                        ? 'Pendiente'
                                                        : 'Completada'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {format(new Date(booking.bookingDate), "EEEE d 'de' MMMM", {
                                                    locale: es,
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {format(new Date(booking.startTime), 'HH:mm')} -{' '}
                                                {format(new Date(booking.endTime), 'HH:mm')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {booking.location.name}, {booking.location.city}
                                            </span>
                                        </div>
                                        <div className="pt-2">
                                            <p className="text-lg font-semibold text-primary">
                                                ${Number(booking.price)}
                                            </p>
                                        </div>
                                        {booking.status === BookingStatus.pending && (
                                            <CancelBookingButton bookingId={booking.id} />
                                        )}
                                        {booking.status === BookingStatus.confirmed && (
                                            <Link href={`/bookings/${booking.id}/chat`} className="w-full">
                                                <Button variant="secondary" className="w-full" size="sm">
                                                    Chat con Instructor
                                                </Button>
                                            </Link>
                                        )}
                                        {booking.status === BookingStatus.completed && !booking.review && (
                                            <ReviewModal
                                                bookingId={booking.id}
                                                instructorName={booking.instructor.user.firstName}
                                            >
                                                <Button variant="outline" className="w-full" size="sm">
                                                    Calificar Clase ⭐
                                                </Button>
                                            </ReviewModal>
                                        )}
                                        {booking.status === BookingStatus.completed && booking.review && (
                                            <Button variant="ghost" className="w-full" size="sm" disabled>
                                                Clase Calificada ✅
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 font-semibold">No tienes clases programadas</h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Busca instructores y reserva tu próxima clase de surf
                                </p>
                                <Button>Buscar Instructores</Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Past Bookings */}
                {pastBookings.length > 0 && (
                    <div>
                        <h2 className="mb-4 font-heading text-2xl font-bold">Historial</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {pastBookings.map((booking) => (
                                <Card key={booking.id} className="opacity-75">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {booking.instructor.user.firstName}{' '}
                                                    {booking.instructor.user.lastName}
                                                </CardTitle>
                                            </div>
                                            <Badge variant="outline">
                                                {booking.status === BookingStatus.completed
                                                    ? 'Completada'
                                                    : 'Cancelada'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {format(new Date(booking.bookingDate), "d 'de' MMMM, yyyy", {
                                                    locale: es,
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span>{booking.location.name}</span>
                                        </div>
                                        {booking.status === BookingStatus.completed && (
                                            <ReviewModal
                                                bookingId={booking.id}
                                                instructorName={booking.instructor.user.firstName}
                                            >
                                                <Button variant="outline" className="mt-2 w-full" size="sm">
                                                    Dejar Reseña
                                                </Button>
                                            </ReviewModal>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
