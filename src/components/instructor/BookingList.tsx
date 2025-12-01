'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Booking {
    id: string;
    startTime: Date;
    endTime: Date;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
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
    const router = useRouter();
    const [processingId, setProcessingId] = useState<string | null>(null);

    async function updateStatus(id: string, status: 'CONFIRMED' | 'CANCELLED') {
        setProcessingId(id);
        try {
            const response = await fetch(`/api/bookings/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) throw new Error('Error al actualizar estado');

            toast.success(
                status === 'CONFIRMED' ? 'Reserva aceptada' : 'Reserva rechazada'
            );
            router.refresh();
        } catch (error) {
            toast.error('Error al procesar la solicitud');
            console.error(error);
        } finally {
            setProcessingId(null);
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return <Badge className="bg-green-500">Confirmada</Badge>;
            case 'pending':
                return <Badge variant="secondary">Pendiente</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelada</Badge>;
            case 'completed':
                return <Badge variant="outline">Completada</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

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
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell className="text-right">
                                {booking.status === 'pending' && (
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                            onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                                            disabled={!!processingId}
                                        >
                                            {processingId === booking.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Check className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => updateStatus(booking.id, 'CANCELLED')}
                                            disabled={!!processingId}
                                        >
                                            {processingId === booking.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <X className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
