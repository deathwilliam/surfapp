'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { UserType } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            userType: UserType.student,
        },
    });

    const userType = watch('userType');

    const onSubmit = async (data: RegisterInput) => {
        try {
            setIsLoading(true);
            setError('');

            // Register user
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al registrar usuario');
            }

            // Auto login after registration
            const signInResult = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (signInResult?.error) {
                // Registration successful but login failed - redirect to login
                router.push('/login?registered=true');
            } else {
                // Both registration and login successful
                router.push(
                    data.userType === UserType.instructor
                        ? '/dashboard/instructor'
                        : '/dashboard/student'
                );
            }
        } catch (err: any) {
            setError(err.message || 'Error al registrar usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="font-heading text-3xl font-bold">Crear Cuenta</h1>
                    <p className="mt-2 text-muted-foreground">
                        Únete a la comunidad de surf
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {/* User Type Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo de cuenta</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label
                                className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-4 transition-colors ${userType === UserType.student
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    value={UserType.student}
                                    {...register('userType')}
                                    className="sr-only"
                                />
                                <div className="text-center">
                                    <div className="text-2xl">👨‍🎓</div>
                                    <div className="mt-2 font-medium">Estudiante</div>
                                </div>
                            </label>

                            <label
                                className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-4 transition-colors ${userType === UserType.instructor
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    value={UserType.instructor}
                                    {...register('userType')}
                                    className="sr-only"
                                />
                                <div className="text-center">
                                    <div className="text-2xl">🏄</div>
                                    <div className="mt-2 font-medium">Instructor</div>
                                </div>
                            </label>
                        </div>
                        {errors.userType && (
                            <p className="text-sm text-destructive">{errors.userType.message}</p>
                        )}
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
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
                                <p className="text-sm text-destructive">{errors.firstName.message}</p>
                            )}
                        </div>

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
                                <p className="text-sm text-destructive">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="tu@email.com"
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
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

                    {/* Password */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirmar Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword')}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                    </Button>

                    {/* Login Link */}
                    <p className="text-center text-sm text-muted-foreground">
                        ¿Ya tienes cuenta?{' '}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
