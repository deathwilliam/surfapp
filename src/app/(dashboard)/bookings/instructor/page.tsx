import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BookingStatus, UserType } from '@prisma/client';

async function getInstructorBookings(instructorProfileId: string) {
    const bookings = await prisma.booking.findMany({
        where: { instructorId: instructorProfileId },
        include: {
            student: {
                select: {
                    firstName: true,
                    lastName: true,
                    profileImageUrl: true,
                    phone: true,
                    email: true,
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

    return bookings;
}

async function getInstructorProfile(userId: string) {
    const profile = await prisma.instructorProfile.findUnique({
        where: { userId },
        select: { id: true },
    });
    return profile;
}

export default async function InstructorBookingsPage() {
    const session = await auth();

    if (!session || !session.user || session.user.userType !== UserType.instructor) {
        redirect('/dashboard/student');
    }

    const instructorProfile = await getInstructorProfile(session.user.id);

    if (!instructorProfile) {
        redirect('/dashboard/student');
    }

    const bookings = await getInstructorBookings(instructorProfile.id);

    const upcomingBookings = bookings.filter(
        (b) =>
            new Date(b.bookingDate) >= new Date() &&
            b.status !== BookingStatus.cancelled &&
            b.status !== BookingStatus.completed
    );

    const todayBookings = upcomingBookings.filter(
        (b) =>
            format(new Date(b.bookingDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    );

    const pendingBookings = bookings.filter((b) => b.status === BookingStatus.pending);

    return (
        <div className="container py-10">
            <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold">Mis Clases</h1>
                <p className="text-muted-foreground">Gestiona tus reservas y alumnos</p>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Clases Hoy
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{todayBookings.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Próximas Clases
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{upcomingBookings.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pendientes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{pendingBookings.length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Classes */}
            {todayBookings.length > 0 && (
                <div className="mb-10">
                    <h2 className="mb-4 font-heading text-2xl font-bold">Clases de Hoy</h2>
                    <div className="grid gap-4">
                        {todayBookings.map((booking) => (
                            <Card key={booking.id} className="border-primary">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src={booking.student.profileImageUrl || ''}
                                                    alt={booking.student.firstName}
                                                />
                                                <AvatarFallback>
                                                    {booking.student.firstName[0]}
                                                    {booking.student.lastName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-2">
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {booking.student.firstName}{' '}
                                                        {booking.student.lastName}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {booking.student.email}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span>
                                                            {format(new Date(booking.startTime), 'HH:mm')}
                                                            {' '}-{' '}
                                                            {format(new Date(booking.endTime), 'HH:mm')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span>{booking.location.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                        <span>${Number(booking.price)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge>{booking.status}</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Classes */}
            <div className="mb-10">
                <h2 className="mb-4 font-heading text-2xl font-bold">Próximas Clases</h2>
                {upcomingBookings.length > 0 ? (
                    <div className="grid gap-4">
                        {upcomingBookings.map((booking) => (
                            <Card key={booking.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src={booking.student.profileImageUrl || ''}
                                                    alt={booking.student.firstName}
                                                />
                                                <AvatarFallback>
                                                    {booking.student.firstName[0]}
                                                    {booking.student.lastName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-2">
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {booking.student.firstName}{' '}
                                                        {booking.student.lastName}
                                                    </h3>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>
                                                            {format(
                                                                new Date(booking.bookingDate),
                                                                "d 'de' MMMM",
                                                                { locale: es }
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>
                                                            {format(new Date(booking.startTime), 'HH:mm')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{booking.location.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge
                                                variant={
                                                    booking.status === BookingStatus.confirmed
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {booking.status === BookingStatus.confirmed
                                                    ? 'Confirmada'
                                                    : 'Pendiente'}
                                            </Badge>
                                            <p className="mt-2 font-semibold text-primary">
                                                ${Number(booking.price)}
                                            </p>
                                            <Link href={`/bookings/${booking.id}/chat`}>
                                                <Button variant="ghost" size="sm" className="mt-2">
                                                    Chat
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                            <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 font-semibold">No tienes clases programadas</h3>
                            <p className="text-sm text-muted-foreground">
                                Las nuevas reservas aparecerán aquí
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
