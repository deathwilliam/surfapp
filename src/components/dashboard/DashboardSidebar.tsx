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
    LogOut,
    Shield,
    Users,
    BarChart,
    MapPin,
    BookOpen
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { UserType } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function DashboardSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userType = session?.user?.userType;
    const { t } = useLanguage();
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        if (session?.user) {
            const fetchUnread = async () => {
                try {
                    const res = await fetch('/api/messages/unread');
                    if (res.ok) {
                        const data = await res.json();
                        setUnreadMessages(data.count);
                    }
                } catch (e) {
                    console.error(e);
                }
            };
            fetchUnread();
            const interval = setInterval(fetchUnread, 10000); // 10s poll
            return () => clearInterval(interval);
        }
    }, [session]);

    const instructorLinks = [
        { href: '/dashboard/instructor', label: t('dashboard'), icon: LayoutDashboard },
        { href: '/dashboard/instructor/bookings', label: 'Mis Clases', icon: BookOpen },
        { href: '/dashboard/instructor/profile', label: t('profile'), icon: User },
        { href: '/dashboard/instructor/availability', label: t('availability'), icon: Calendar },
        { href: '/dashboard/messages', label: t('messages'), icon: MessageSquare },
    ];

    const studentLinks = [
        { href: '/dashboard/student', label: t('dashboard'), icon: LayoutDashboard },
        { href: '/bookings', label: t('myBookings'), icon: Calendar },
        { href: '/dashboard/messages', label: t('messages'), icon: MessageSquare },
    ];

    const adminLinks = [
        { href: '/dashboard/admin/locations', label: 'Ubicaciones', icon: MapPin },
        { href: '/dashboard/admin/stats', label: 'Estadísticas', icon: BarChart },
    ];

    let links = studentLinks;
    if (userType === UserType.instructor) {
        links = instructorLinks;
    } else if (userType === 'admin') {
        links = adminLinks;
    }

    return (
        <aside className="w-64 border-r border-sidebar-border bg-gradient-to-b from-blue-50/50 to-background hidden md:block">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-foreground/80 mb-6 px-2">Menu</h2>
                <nav className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        const isMessageLink = link.href === '/dashboard/messages';

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="flex-1">{link.label}</span>
                                {isMessageLink && unreadMessages > 0 && (
                                    <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                        {unreadMessages > 9 ? '9+' : unreadMessages}
                                    </Badge>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
