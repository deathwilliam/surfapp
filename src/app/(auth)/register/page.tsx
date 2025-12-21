'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { UserType } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
        userType: UserType.student,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    },
});

const userType = form.watch('userType');

const onSubmit = async (data: RegisterInput) => {
    try {
        setIsLoading(true);
        setError('');

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al registrar usuario');
        }

        const signInResult = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (signInResult?.error) {
            router.push('/login?registered=true');
        } else {
            try {
                await fetch('/api/auth/set-role-cookie', { method: 'POST', credentials: 'include' });
            } catch (e) {
                console.error('Failed to set role cookie', e);
            }

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#00D4D4] via-[#00B8B8] to-[#FF6B35] px-4 py-12">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-blue-200 bg-white p-8 shadow-2xl">
            <div className="text-center">
                <h1 className="font-heading text-3xl font-bold text-primary">Crear Cuenta</h1>
                <p className="mt-2 text-muted-foreground">
                    Únete a la comunidad de surf
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="userType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de cuenta</FormLabel>
                                <FormControl>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label
                                            className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-4 transition-colors ${field.value === UserType.student
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                value={UserType.student}
                                                checked={field.value === UserType.student}
                                                onChange={() => field.onChange(UserType.student)}
                                                className="sr-only"
                                            />
                                            <div className="text-center">
                                                <div className="text-2xl">👨‍🎓</div>
                                                <div className="mt-2 font-medium">Estudiante</div>
                                            </div>
                                        </label>

                                        <label
                                            className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-4 transition-colors ${field.value === UserType.instructor
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                value={UserType.instructor}
                                                checked={field.value === UserType.instructor}
                                                onChange={() => field.onChange(UserType.instructor)}
                                                className="sr-only"
                                            />
                                            <div className="text-center">
                                                <div className="text-2xl">🏄</div>
                                                <div className="mt-2 font-medium">Instructor</div>
                                            </div>
                                        </label>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Juan" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apellido</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Pérez" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="tu@email.com"
                                        type="email"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono <span className="text-muted-foreground">(opcional)</span></FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="+503 7123-4567"
                                        type="tel"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="••••••••"
                                        type="password"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmar Contraseña</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="••••••••"
                                        type="password"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        ¿Ya tienes cuenta?{' '}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                </form>
            </Form>
        </div>
    </div>
);
}
