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
import { Check, X, CheckCircle, XCircle } from 'lucide-react';

// Define status locally to avoid import issues in client component
const STATUS_PENDING = 'pending';
const STATUS_CONFIRMED = 'confirmed';
const STATUS_COMPLETED = 'completed';
const STATUS_NO_SHOW = 'no_show';
const STATUS_CANCELLED = 'cancelled';

interface BookingActionsProps {
    bookingId: string;
    currentStatus: string;
    isInstructor: boolean;
    cancellationReason?: string | null;
}

export function BookingActions({ bookingId, currentStatus, isInstructor, cancellationReason: initialReason }: BookingActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showReasonDialog, setShowReasonDialog] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');

    const updateStatus = async (newStatus: string, reason?: string) => {
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
        updateStatus(STATUS_CANCELLED, cancellationReason);
    };

    return (
        <>
            <div className="flex gap-2 flex-wrap justify-end">
                {currentStatus === STATUS_CANCELLED && initialReason && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowReasonDialog(true)}
                        className="text-muted-foreground"
                    >
                        Ver Razón
                    </Button>
                )}

                {isInstructor && currentStatus === STATUS_PENDING && (
                    <Button
                        size="sm"
                        onClick={() => updateStatus(STATUS_CONFIRMED)}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Check className="h-4 w-4 mr-1" />
                        Confirmar
                    </Button>
                )}

                {isInstructor && currentStatus === STATUS_CONFIRMED && (
                    <Button
                        size="sm"
                        onClick={() => updateStatus(STATUS_COMPLETED)}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completar
                    </Button>
                )}

                {isInstructor && currentStatus === STATUS_CONFIRMED && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(STATUS_NO_SHOW)}
                        disabled={isLoading}
                    >
                        <XCircle className="h-4 w-4 mr-1" />
                        No Show
                    </Button>
                )}

                {(currentStatus === STATUS_PENDING || currentStatus === STATUS_CONFIRMED) && (
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

            <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Razón de Cancelación</DialogTitle>
                    </DialogHeader>
                    <div className="p-4 bg-muted/20 rounded-md border">
                        <p className="text-sm text-foreground">{initialReason}</p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
