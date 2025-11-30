import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, Users, DollarSign, TrendingUp, Clock, MapPin, MessageSquare } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { BookingStatus, UserType } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EarningsChart } from '@/components/dashboard/EarningsChart';

async function getInstructorStats(userId: string) {
    const instructorProfile = await prisma.instructorProfile.findUnique({
        where: { userId },
        include: {
            bookings: {
                include: {
                    student: {
                        select: {
                            firstName: true,
                            lastName: true,
                            profileImageUrl: true,
                            email: true,
                        },
                    },
                    location: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!instructorProfile) return null;

    const now = new Date();
    const bookings = instructorProfile.bookings;

    // Stats
    const totalStudents = new Set(bookings.map((b) => b.studentId)).size;
    const completedBookings = bookings.filter((b) => b.status === BookingStatus.completed);
    const totalHours = completedBookings.length * 2; // Assuming 2 hours per session
    const totalEarnings = completedBookings.reduce((acc, curr) => acc + Number(curr.price), 0);

    // Upcoming classes
    const upcomingClasses = bookings
        .filter(
            (b) =>
                new Date(b.bookingDate) >= now &&
                b.status !== BookingStatus.cancelled &&
                b.status !== BookingStatus.completed
        )
        .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())
        .slice(0, 5);

    // Monthly Earnings Data for Chart (Last 6 months)
    const last6Months = eachMonthOfInterval({
        start: subMonths(now, 5),
        end: now,
    });

    const monthlyEarnings = last6Months.map((month) => {
        const start = startOfMonth(month);
        const end = endOfMonth(month);

        const monthlyTotal = bookings
            .filter(
                (b) =>
                    b.status === BookingStatus.completed &&
                    new Date(b.bookingDate) >= start &&
                    new Date(b.bookingDate) <= end
            )
            .reduce((acc, curr) => acc + Number(curr.price), 0);

        return {
            name: format(month, 'MMM', { locale: es }),
            total: monthlyTotal,
        };
    });

    return {
        totalStudents,
        totalHours,
        totalEarnings,
        upcomingClasses,
        monthlyEarnings,
    };
}

export default async function InstructorDashboard() {
    const session = await auth();

    if (!session || !session.user || session.user.userType !== UserType.instructor) {
        redirect('/dashboard/student');
    }

    const stats = await getInstructorStats(session.user.id);

    if (!stats) {
        return <div>Error cargando perfil de instructor</div>;
    }

    const { totalStudents, totalHours, totalEarnings, upcomingClasses, monthlyEarnings } = stats;

    return (
        <div className="container py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold">
                        Panel de Instructor
                    </h1>
                    <p className="text-muted-foreground">
                        Resumen de tu actividad y ganancias
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/profile/instructor">
                        <Button variant="outline">Mi Perfil</Button>
                    </Link>
                    <Link href="/bookings/instructor">
                        <Button>Gestionar Clases</Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalEarnings}</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% desde el mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">
                            Estudiantes únicos enseñados
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Horas Enseñadas</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalHours}</div>
                        <p className="text-xs text-muted-foreground">
                            Horas totales en el agua
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clases Activas</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingClasses.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Reservas próximas confirmadas
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Resumen de Ingresos</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <EarningsChart data={monthlyEarnings} />
                    </CardContent>
                </Card>

                {/* Recent Activity / Upcoming Classes */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Próximas Clases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {upcomingClasses.length > 0 ? (
                                upcomingClasses.map((booking) => (
                                    <div key={booking.id} className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage
                                                src={booking.student.profileImageUrl || ''}
                                                alt={booking.student.firstName}
                                            />
                                            <AvatarFallback>
                                                {booking.student.firstName[0]}
                                                {booking.student.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {booking.student.firstName} {booking.student.lastName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(
                                                    new Date(booking.bookingDate),
                                                    "d 'de' MMM",
                                                    { locale: es }
                                                )}{' '}
                                                - {booking.location.name}
                                            </p>
                                        </div>
                                        <div className="ml-auto flex items-center gap-2">
                                            <span className="font-medium">
                                                +${Number(booking.price)}
                                            </span>
                                            <Link href={`/dashboard/messages?bookingId=${booking.id}`}>
                                                <Button size="sm" variant="ghost">
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm text-muted-foreground">
                                    No hay clases próximas
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
