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
import { X, Check, Loader2, User, Calendar, Clock, DollarSign } from 'lucide-react';

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
            <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 gap-0 border-cyan-200">
                <DialogHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        Confirmar Reserva
                    </DialogTitle>
                    <DialogDescription className="text-blue-50">
                        Revisa los detalles de tu clase antes de confirmar.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    <div className="rounded-lg bg-cyan-50/50 p-4 border border-cyan-100 space-y-3">
                        {/* Instructor */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <User className="h-4 w-4 text-cyan-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Instructor</p>
                                <p className="font-semibold text-gray-900">{instructor.name}</p>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <Calendar className="h-4 w-4 text-cyan-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Fecha</p>
                                <p className="font-semibold text-gray-900 capitalize">
                                    {format(
                                        typeof slot.date === 'string' ? parseISO(slot.date) : slot.date,
                                        "EEEE d 'de' MMMM",
                                        { locale: es }
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <Clock className="h-4 w-4 text-cyan-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Hora</p>
                                <p className="font-semibold text-gray-900">
                                    {(() => {
                                        const start = new Date(slot.startTime);
                                        const end = new Date(slot.endTime);
                                        const sh = start.getUTCHours().toString().padStart(2, '0');
                                        const sm = start.getUTCMinutes().toString().padStart(2, '0');
                                        const eh = end.getUTCHours().toString().padStart(2, '0');
                                        const em = end.getUTCMinutes().toString().padStart(2, '0');
                                        return `${sh}:${sm} - ${eh}:${em}`;
                                    })()}
                                </p>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 pt-2 border-t border-cyan-100 mt-2">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <DollarSign className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Precio Total</p>
                                <p className="text-lg font-bold text-green-600">${instructor.hourlyRate}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0 bg-gray-50/50">
                    <div className="flex w-full gap-2">
                        <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="mr-2 h-4 w-4" />
                            )}
                            {isLoading ? 'Confirmando...' : 'Confirmar Reserva'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
