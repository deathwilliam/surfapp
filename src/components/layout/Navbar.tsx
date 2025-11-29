'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { UserMenu } from '@/components/auth/UserMenu';

export function Navbar() {
    const { status } = useSession();
    const isAuthenticated = status === 'authenticated';

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-heading text-xl font-bold text-primary">
                            SurfConnect 🏄
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/search" className="transition-colors hover:text-primary">
                        Buscar Instructores
                    </Link>
                    <Link href="/how-it-works" className="transition-colors hover:text-primary">
                        Cómo funciona
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <UserMenu />
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Iniciar Sesión
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Registrarse</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
