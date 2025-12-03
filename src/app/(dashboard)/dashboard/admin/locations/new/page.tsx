'use client';

import { LocationForm, LocationFormData } from '@/components/admin/LocationForm';
import { createLocation } from '../actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewLocationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: LocationFormData) => {
        try {
            setIsLoading(true);
            await createLocation(data);
            toast.success('Ubicación creada exitosamente');
        } catch (error) {
            console.error(error);
            toast.error('Error al crear la ubicación');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/locations">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nueva Ubicación</h1>
                    <p className="text-muted-foreground">
                        Agrega una nueva ubicación para las clases de surf.
                    </p>
                </div>
            </div>

            <div className="border rounded-lg p-6 bg-card">
                <LocationForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </div>
    );
}
