'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ClearHistoryButton() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClear = async () => {
        if (!confirm('¿Estás seguro de que quieres eliminar todas las reservas CANCELADAS de tu historial?')) {
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/bookings/cleanup?status=cancelled', {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Error al limpiar el historial');
            }
        } catch (error) {
            console.error(error);
            alert('Error al procesar la solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={isLoading}
            className="text-muted-foreground hover:text-destructive gap-2"
        >
            <Trash2 className="h-4 w-4" />
            Limpiar Canceladas
        </Button>
    );
}
