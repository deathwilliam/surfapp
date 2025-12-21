'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X, Check, Loader2 } from 'lucide-react';

interface TimeSlot {
    id: string;
    date: Date;
    startTime: Date;
    endTime: Date;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    slot: TimeSlot | null;
    instructor: {
        id: string;
        name: string;
        hourlyRate: number;
    };
}

export function BookingModal({
    isOpen,
    onClose,
    slot,
    instructor,
}: BookingModalProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    if (!slot) return null;

    const handleConfirm = async () => {
        if (!session) {
            router.push('/login?callbackUrl=' + window.location.pathname);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instructorId: instructor.id,
                    availabilityId: slot.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear la reserva');
            }

            onClose();
            router.push('/dashboard/student?booking=success');
            router.refresh();
        } catch (error) {
            console.error('Booking error:', error);
            // Here we should show an error toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirmar Reserva</DialogTitle>
                    <DialogDescription>
                        Revisa los detalles de tu clase antes de confirmar.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Instructor:</span>
                        <span className="col-span-3">{instructor.name}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Fecha:</span>
                        <span className="col-span-3">
                            {format(
                                typeof slot.date === 'string'
                                    ? parseISO(slot.date)
                                    : slot.date,
                                "EEEE d 'de' MMMM",
                                {
                                    locale: es,
                                }
                            )}
                        </span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Hora:</span>
                        <span className="col-span-3">
                            {(() => {
                                const start = new Date(slot.startTime);
                                const end = new Date(slot.endTime);
                                const sh = start.getUTCHours().toString().padStart(2, '0');
                                const sm = start.getUTCMinutes().toString().padStart(2, '0');
                                const eh = end.getUTCHours().toString().padStart(2, '0');
                                const em = end.getUTCMinutes().toString().padStart(2, '0');
                                return `${sh}:${sm} - ${eh}:${em}`;
                            })()}
                        </span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Precio:</span>
                        <span className="col-span-3 text-lg font-semibold text-primary">
                            ${instructor.hourlyRate}
                        </span>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Check className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? 'Confirmando...' : 'Confirmar Reserva'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
