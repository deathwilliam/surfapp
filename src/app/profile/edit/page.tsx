'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const profileSchema = z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    phone: z.string().optional(),
    profileImageUrl: z.string().url().optional().or(z.literal('')),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
    });

    // Fetch profile data on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/profile');
                if (response.ok) {
                    const data = await response.json();
                    reset({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        phone: data.phone || '',
                        profileImageUrl: data.profileImageUrl || '',
                    });
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        if (session) {
            fetchProfile();
        }
    }, [session, reset]);

    const onSubmit = async (data: ProfileInput) => {
        try {
            setIsLoading(true);
            setError('');

            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al actualizar perfil');
            }

            // Update session
            await update();

            router.push('/profile');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Error al actualizar perfil');
        } finally {
            setIsLoading(false);
        }
    };

    if (!session) {
        return null;
    }

    return (
        <div className="container py-10">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <Link
                        href="/profile"
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Volver al perfil
                    </Link>
                    <h1 className="mt-4 font-heading text-3xl font-bold">Editar Perfil</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            {/* Avatar Preview */}
                            <div className="flex justify-center">
                                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                    <AvatarImage
                                        src={session.user?.image || ''}
                                        alt={`${session.user?.firstName} ${session.user?.lastName}`}
                                    />
                                    <AvatarFallback className="text-4xl">
                                        {session.user?.firstName?.[0]}
                                        {session.user?.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* First Name */}
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="text-sm font-medium">
                                    Nombre
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    {...register('firstName')}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Juan"
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-destructive">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="text-sm font-medium">
                                    Apellido
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    {...register('lastName')}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Pérez"
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-destructive">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium">
                                    Teléfono <span className="text-muted-foreground">(opcional)</span>
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    {...register('phone')}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="+503 7123-4567"
                                />
                                {errors.phone && (
                                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                                )}
                            </div>

                            {/* Profile Image URL */}
                            <div className="space-y-2">
                                <label htmlFor="profileImageUrl" className="text-sm font-medium">
                                    URL de Imagen de Perfil{' '}
                                    <span className="text-muted-foreground">(opcional)</span>
                                </label>
                                <input
                                    id="profileImageUrl"
                                    type="url"
                                    {...register('profileImageUrl')}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                                {errors.profileImageUrl && (
                                    <p className="text-sm text-destructive">
                                        {errors.profileImageUrl.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <Button type="submit" className="flex-1" disabled={isLoading}>
                                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                                <Link href="/profile" className="flex-1">
                                    <Button type="button" variant="outline" className="w-full">
                                        Cancelar
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
