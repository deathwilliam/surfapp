import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, TrendingUp, Award, DollarSign, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BookingStatus } from '@prisma/client';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

async function getStudentStats(userId: string) {
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
        },
        orderBy: {
            bookingDate: 'asc',
        },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedBookings = bookings.filter((b) => b.status === BookingStatus.completed);
    const upcomingBookings = bookings.filter(
        (b) => new Date(b.bookingDate) >= today && b.status !== BookingStatus.cancelled
    );
    const nextBooking = upcomingBookings[0];

    const totalSpent = completedBookings.reduce((acc, curr) => acc + Number(curr.price), 0);
    const totalHours = completedBookings.length * 2; // Assuming 2 hours per session for now

    return {
        bookings,
        completedBookings,
        upcomingBookings,
        nextBooking,
        totalSpent,
        totalHours,
    };
}

export default async function StudentDashboard() {
    const session = await auth();

    if (!session || !session.user) {
        redirect('/login');
    }

    const {
        completedBookings,
        upcomingBookings,
        nextBooking,
        totalSpent,
        totalHours,
    } = await getStudentStats(session.user.id);

    return (
        <div className="container py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-primary">
                        Hola, {session.user.firstName}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Bienvenido a tu panel de estudiante.
                    </p>
                </div>
                <Link href="/search">
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md transition-all hover:scale-105">
                        Nueva Reserva 🏄‍♂️
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Upcoming Classes Stat */}
                <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Próximas Clases</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {upcomingBookings.length > 0
                                ? 'Prepárate para surfear 🏄‍♂️'
                                : 'No tienes clases programadas'}
                        </p>
                    </CardContent>
                </Card>

                {/* Completed Classes Stat */}
                <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clases Completadas</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedBookings.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {totalHours} horas de surf totales
                        </p>
                    </CardContent>
                </Card>

                {/* Total Spent Stat */}
                <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inversión Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalSpent}</div>
                        <p className="text-xs text-muted-foreground">
                            En tu aprendizaje de surf
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
                {/* Next Lesson Card */}
                <div>
                    <h2 className="mb-4 font-heading text-2xl font-bold text-primary">Tu Próxima Clase</h2>
                    {nextBooking ? (
                        <Card className="border-blue-200 shadow-md bg-white">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage
                                                src={
                                                    nextBooking.instructor.user.profileImageUrl || ''
                                                }
                                                alt={nextBooking.instructor.user.firstName}
                                            />
                                            <AvatarFallback>
                                                {nextBooking.instructor.user.firstName[0]}
                                                {nextBooking.instructor.user.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {nextBooking.instructor.user.firstName}{' '}
                                                {nextBooking.instructor.user.lastName}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">
                                                Instructor de Surf
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            nextBooking.status === BookingStatus.confirmed
                                                ? 'secondary'
                                                : 'outline'
                                        }
                                    >
                                        {nextBooking.status === BookingStatus.confirmed
                                            ? 'Confirmada'
                                            : 'Pendiente'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                            {format(
                                                new Date(nextBooking.bookingDate),
                                                "EEEE d 'de' MMMM",
                                                { locale: es }
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            {format(
                                                new Date(nextBooking.startTime),
                                                'HH:mm'
                                            )}{' '}
                                            -{' '}
                                            {format(
                                                new Date(nextBooking.endTime),
                                                'HH:mm'
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            {nextBooking.location.name}, {nextBooking.location.city}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/messages/${nextBooking.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Mensaje
                                        </Button>
                                    </Link>
                                    <Link href="/bookings" className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            Ver Detalles
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="flex h-[250px] flex-col items-center justify-center text-center">
                            <Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <h3 className="text-lg font-semibold">Sin clases próximas</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                ¿Listo para volver al agua?
                            </p>
                            <Link href="/search">
                                <Button>Reservar Clase</Button>
                            </Link>
                        </Card>
                    )}
                </div>

                {/* Recent Activity / Tips */}
                <div>
                    <h2 className="mb-4 font-heading text-2xl font-bold text-primary">Consejo del Día</h2>
                    <Card className="h-full bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                        <CardContent className="flex h-full flex-col justify-center p-6">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold">La constancia es clave</h3>
                            <p className="text-muted-foreground">
                                "El surf no se trata solo de pararse en la tabla, sino de entender el océano.
                                Cada sesión te enseña algo nuevo, incluso si no atrapas la mejor ola del día."
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
