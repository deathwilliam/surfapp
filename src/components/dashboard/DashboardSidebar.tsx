'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    User,
    Calendar,
    MessageSquare,
    Settings,
    LogOut
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { UserType } from '@prisma/client';

export function DashboardSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userType = session?.user?.userType;

    const instructorLinks = [
        { href: '/dashboard/instructor', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/instructor/profile', label: 'Perfil', icon: User },
        { href: '/dashboard/instructor/availability', label: 'Disponibilidad', icon: Calendar },
        { href: '/dashboard/messages', label: 'Mensajes', icon: MessageSquare },
    ];

    const studentLinks = [
        { href: '/dashboard/student', label: 'Overview', icon: LayoutDashboard },
        { href: '/bookings', label: 'Mis Reservas', icon: Calendar },
        { href: '/dashboard/messages', label: 'Mensajes', icon: MessageSquare },
    ];

    const links = userType === UserType.instructor ? instructorLinks : studentLinks;

    return (
        <aside className="w-64 border-r border-sidebar-border bg-gradient-to-b from-blue-50/50 to-background hidden md:block">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-foreground/80 mb-6 px-2">Menu</h2>
                <nav className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
