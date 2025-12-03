'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { BookingStatus } from '@prisma/client';
import { Check, X, CheckCircle, XCircle } from 'lucide-react';

interface BookingActionsProps {
    bookingId: string;
    currentStatus: BookingStatus;
    isInstructor: boolean;
}

export function BookingActions({ bookingId, currentStatus, isInstructor }: BookingActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');

    const updateStatus = async (newStatus: BookingStatus, reason?: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    ...(reason && { cancellationReason: reason }),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al actualizar');
            }

            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Error al actualizar la reserva');
        } finally {
            setIsLoading(false);
            setShowCancelDialog(false);
            setCancellationReason('');
        }
    };

    const handleCancel = () => {
        if (!cancellationReason.trim()) {
            alert('Por favor ingresa una razón de cancelación');
            return;
        }
        updateStatus(BookingStatus.cancelled, cancellationReason);
    };

    return (
        <>
            <div className="flex gap-2 flex-wrap">
                {isInstructor && currentStatus === BookingStatus.pending && (
                    <Button
                        size="sm"
                        onClick={() => updateStatus(BookingStatus.confirmed)}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Check className="h-4 w-4 mr-1" />
                        Confirmar
                    </Button>
                )}

                {isInstructor && currentStatus === BookingStatus.confirmed && (
                    <Button
                        size="sm"
                        onClick={() => updateStatus(BookingStatus.completed)}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completar
                    </Button>
                )}

                {isInstructor && currentStatus === BookingStatus.confirmed && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(BookingStatus.no_show)}
                        disabled={isLoading}
                    >
                        <XCircle className="h-4 w-4 mr-1" />
                        No Show
                    </Button>
                )}

                {(currentStatus === BookingStatus.pending || currentStatus === BookingStatus.confirmed) && (
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setShowCancelDialog(true)}
                        disabled={isLoading}
                    >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                    </Button>
                )}
            </div>

            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancelar Reserva</DialogTitle>
                        <DialogDescription>
                            Por favor indica la razón de la cancelación.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="Razón de cancelación..."
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        className="min-h-[100px]"
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                            disabled={isLoading}
                        >
                            Cerrar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cancelando...' : 'Confirmar Cancelación'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
