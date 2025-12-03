'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    relatedEntityType: string | null;
    relatedEntityId: string | null;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.slice(0, 5));
                setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="font-semibold">Notificaciones</h3>
                    {unreadCount > 0 && (
                        <Badge variant="secondary">{unreadCount} nuevas</Badge>
                    )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No tienes notificaciones
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`border-b p-4 hover:bg-muted/50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''
                                    }`}
                                onClick={() => {
                                    if (!notification.isRead) {
                                        markAsRead(notification.id);
                                    }
                                    setIsOpen(false);
                                }}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{notification.title}</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {formatDistanceToNow(new Date(notification.createdAt), {
                                                addSuffix: true,
                                                locale: es,
                                            })}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {notifications.length > 0 && (
                    <div className="border-t p-2">
                        <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full text-sm">
                                Ver todas las notificaciones
                            </Button>
                        </Link>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
