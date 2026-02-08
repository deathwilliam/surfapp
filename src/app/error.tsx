'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to reporting service
        if (process.env.NODE_ENV === 'production') {
            // TODO: Send to error reporting
        }
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-background">
            <div className="rounded-full bg-destructive/10 p-6 mb-6">
                <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">¡Ups! Algo salió mal</h1>
            <p className="text-muted-foreground mb-6 max-w-md">
                Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
            </p>
            <div className="flex gap-4">
                <Button onClick={reset} variant="default">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Reintentar
                </Button>
                <Button asChild variant="outline">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Ir al inicio
                    </Link>
                </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
                <pre className="mt-8 p-4 bg-muted rounded-md text-left text-xs overflow-auto max-w-2xl">
                    {error.message}
                    {error.digest && `\n\nDigest: ${error.digest}`}
                </pre>
            )}
        </div>
    );
}
