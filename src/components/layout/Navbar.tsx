'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { UserMenu } from '@/components/auth/UserMenu';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ModeToggle } from '@/components/layout/ModeToggle';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Menu, X, Waves } from 'lucide-react';

export function Navbar() {
    const { status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useLanguage();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const isActive = (path: string) => pathname === path;

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${isScrolled
                ? 'bg-background/98 backdrop-blur-md shadow-md'
                : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
                }`}
        >
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <Waves className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                        <span className="font-heading text-xl font-bold bg-gradient-to-r from-[#00D4D4] to-[#FF6B35] bg-clip-text text-transparent">
                            Surf City
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link
                        href="/search"
                        className={`relative transition-colors hover:text-primary ${isActive('/search') ? 'text-primary' : ''
                            }`}
                    >
                        {t('search')}
                        {isActive('/search') && (
                            <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#00D4D4] to-[#FF6B35]" />
                        )}
                    </Link>
                    <Link
                        href="/how-it-works"
                        className={`relative transition-colors hover:text-primary ${isActive('/how-it-works') ? 'text-primary' : ''
                            }`}
                    >
                        {t('howItWorks')}
                        {isActive('/how-it-works') && (
                            <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#00D4D4] to-[#FF6B35]" />
                        )}
                    </Link>
                    <Link
                        href="/ai-advisor"
                        className={`relative transition-colors hover:text-primary ${isActive('/ai-advisor') ? 'text-primary' : ''
                            }`}
                    >
                        {t('advisor')}
                        {isActive('/ai-advisor') && (
                            <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#00D4D4] to-[#FF6B35]" />
                        )}
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <ModeToggle />
                    <LanguageToggle />
                    {isAuthenticated ? (
                        <>
                            <NotificationBell />
                            <UserMenu />
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="hover:text-primary">
                                    {t('login')}
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="bg-gradient-to-r from-[#00D4D4] to-[#00B8B8] hover:from-[#00B8B8] hover:to-[#008B8B] text-white transition-all">
                                    {t('register')}
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-background/98 backdrop-blur-md animate-in slide-in-from-top-5 duration-300">
                    <nav className="container py-4 flex flex-col gap-4">
                        <Link
                            href="/search"
                            className={`px-4 py-2 rounded-md transition-colors ${isActive('/search')
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'hover:bg-accent'
                                }`}
                        >
                            {t('search')}
                        </Link>
                        <Link
                            href="/how-it-works"
                            className={`px-4 py-2 rounded-md transition-colors ${isActive('/how-it-works')
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'hover:bg-accent'
                                }`}
                        >
                            {t('howItWorks')}
                        </Link>
                        <Link
                            href="/ai-advisor"
                            className={`px-4 py-2 rounded-md transition-colors ${isActive('/ai-advisor')
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'hover:bg-accent'
                                }`}
                        >
                            {t('advisor')}
                        </Link>

                        <div className="border-t pt-4 mt-2 flex flex-col gap-3">
                            <div className="flex gap-4 px-4">
                                <ModeToggle />
                                <LanguageToggle />
                            </div>
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3 px-4">
                                    <NotificationBell />
                                    <UserMenu />
                                </div>
                            ) : (
                                <>
                                    <Link href="/login" className="w-full">
                                        <Button variant="outline" className="w-full">
                                            {t('login')}
                                        </Button>
                                    </Link>
                                    <Link href="/register" className="w-full">
                                        <Button className="w-full bg-gradient-to-r from-[#00D4D4] to-[#00B8B8] text-white">
                                            {t('register')}
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
