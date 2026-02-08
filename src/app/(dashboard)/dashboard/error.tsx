'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Error en el Dashboard</h2>
            <p className="text-muted-foreground mb-4 max-w-md">
                Ha ocurrido un error al cargar esta sección. Por favor, intenta de nuevo.
            </p>
            <div className="flex gap-3">
                <Button onClick={reset}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Reintentar
                </Button>
                <Button asChild variant="outline">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Inicio
                    </Link>
                </Button>
            </div>
        </div>
    );
}
