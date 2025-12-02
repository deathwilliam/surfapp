'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CancelBookingButtonProps {
    bookingId: string;
}

export function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCancel = async () => {
        if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' }),
            });

            if (!response.ok) {
                throw new Error('Error al cancelar la reserva');
            }

            router.refresh();
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Error al cancelar la reserva. Por favor intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            className="w-full"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
        >
            {isLoading ? 'Cancelando...' : 'Cancelar Reserva'}
        </Button>
    );
}
