'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const profileSchema = z.object({
    bio: z.string().min(10, 'La biografía debe tener al menos 10 caracteres'),
    experienceYears: z.coerce.number().min(0, 'Los años de experiencia no pueden ser negativos'),
    hourlyRate: z.coerce.number().min(1, 'El precio por hora debe ser mayor a 0'),
    specialties: z.string().transform((str) => str.split(',').map((s) => s.trim()).filter((s) => s !== '')),
});

type ProfileFormValues = {
    bio: string;
    experienceYears: number;
    hourlyRate: number;
    specialties: string;
};

interface ProfileFormProps {
    initialData: {
        bio: string | null;
        experienceYears: number;
        hourlyRate: number;
        specialties: string[];
        locations: { id: string; name: string }[];
    };
    availableLocations: { id: string; name: string }[];
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            bio: initialData.bio || '',
            experienceYears: initialData.experienceYears || 0,
            hourlyRate: initialData.hourlyRate || 0,
            specialties: initialData.specialties.join(', '),
        },
    });

    async function onSubmit(values: ProfileFormValues) {
        setIsLoading(true);
        try {
            const apiValues = {
                ...values,
                specialties: values.specialties.split(',').map((s) => s.trim()).filter((s) => s !== ''),
            };

            const response = await fetch('/api/instructor/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiValues),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el perfil');
            }

            toast.success('Perfil actualizado correctamente');
            router.refresh();
        } catch (error) {
            toast.error('Hubo un error al guardar los cambios');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Biografía</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Cuéntanos sobre tu experiencia y estilo de enseñanza..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Esta descripción aparecerá en tu perfil público.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="experienceYears"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Años de Experiencia</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="hourlyRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio por Hora ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="specialties"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Especialidades (separadas por coma)</FormLabel>
                            <FormControl>
                                <Input placeholder="Longboard, Shortboard, Principiantes..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Ej: Principiantes, Intermedios, Olas Grandes
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </form>
        </Form>
    );
}
