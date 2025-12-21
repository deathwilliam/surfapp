'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BookingStatus } from '@prisma/client';
import { BookingActions } from '@/components/booking/BookingActions';
import { BookingStatusBadge } from '@/components/booking/BookingStatusBadge';

interface Booking {
    id: string;
    startTime: Date;
    endTime: Date;
    status: BookingStatus;
    cancellationReason: string | null;
    student: {
        firstName: string;
        lastName: string;
        email: string | null;
    };
    location: {
        name: string;
    };
}

interface BookingListProps {
    bookings: Booking[];
}

export function BookingList({ bookings }: BookingListProps) {
    if (bookings.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">No tienes reservas registradas.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Estudiante</TableHead>
                        <TableHead>Fecha y Hora</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {`${booking.student.firstName} ${booking.student.lastName}`}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {booking.student.email}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {format(new Date(booking.startTime), "d 'de' MMMM", {
                                            locale: es,
                                        })}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {format(new Date(booking.startTime), 'HH:mm')} -{' '}
                                        {format(new Date(booking.endTime), 'HH:mm')}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>{booking.location.name}</TableCell>
                            <TableCell>
                                <BookingStatusBadge status={booking.status} />
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end">
                                    <BookingActions
                                        bookingId={booking.id}
                                        currentStatus={booking.status}
                                        isInstructor={true}
                                        cancellationReason={booking.cancellationReason}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
