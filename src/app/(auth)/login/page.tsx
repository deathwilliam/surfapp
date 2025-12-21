'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const registered = searchParams.get('registered');

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            setIsLoading(true);
            setError('');

            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError('Credenciales inválidas');
                return;
            }

            try {
                await fetch('/api/auth/set-role-cookie', { method: 'POST', credentials: 'include' });
            } catch (e) {
                console.error('Failed to set role cookie', e);
            }

            const response = await fetch('/api/auth/session');
            const session = await response.json();

            if (session?.user) {
                const userType = (session.user as any).userType;
                if (userType === 'admin') {
                    router.push('/dashboard/admin');
                } else if (userType === 'instructor') {
                    router.push('/dashboard/instructor');
                } else {
                    router.push('/dashboard/student');
                }
            } else {
                router.push('/');
            }
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-blue-200 bg-white p-8 shadow-2xl">
            <div className="text-center">
                <h1 className="font-heading text-3xl font-bold text-primary">Iniciar Sesión</h1>
                <p className="mt-2 text-muted-foreground">
                    Bienvenido de vuelta
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    {registered && (
                        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                            ¡Cuenta creada exitosamente! Por favor inicia sesión.
                        </div>
                    )}

                    {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

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
                                        autoComplete="email"
                                        disabled={isLoading}
                                        {...field}
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
                                <div className="flex items-center justify-between">
                                    <FormLabel>Contraseña</FormLabel>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                                <FormControl>
                                    <Input
                                        placeholder="••••••••"
                                        type="password"
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        ¿No tienes cuenta?{' '}
                        <Link href="/register" className="font-medium text-primary hover:underline">
                            Regístrate
                        </Link>
                    </p>
                </form>
            </Form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#00D4D4] via-[#00B8B8] to-[#FF6B35] px-4 py-12">
            <Suspense fallback={<div>Cargando...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
