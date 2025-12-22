'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Trash2, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Conversation {
    id: string; // Booking ID
    otherUser: {
        name: string;
        image: string | null;
    };
    lastMessage?: {
        text: string;
        createdAt: Date;
    };
    bookingDate: Date;
    status: string;
}

interface ConversationListProps {
    conversations: Conversation[];
}

export function ConversationList({ conversations: initialConversations }: ConversationListProps) {
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

    // Sync state if props change (revalidation)
    useEffect(() => {
        setConversations(initialConversations);
    }, [initialConversations]);

    const handleDelete = async (e: React.MouseEvent, bookingId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('¿Estás seguro de que deseas eliminar este historial de chat? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            // Optimistic update
            setConversations(prev => prev.filter(c => c.id !== bookingId));

            const res = await fetch(`/api/messages/clear?bookingId=${bookingId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                // Revert if failed
                setConversations(initialConversations); // or granular revert
                alert('Error al eliminar los mensajes');
            }
        } catch (error) {
            console.error(error);
            setConversations(initialConversations);
            alert('Error al procesar la solicitud');
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm('⚠️ ¡ATENCIÓN! ¿Estás seguro de que quieres eliminar TODAS tus conversaciones? \n\nEsta acción borrará todo tu historial de mensajes permanentemente y no se puede deshacer.')) {
            return;
        }

        // Double confirmation for safety
        if (!confirm('¿Realmente estás seguro? Se borrará TODO.')) {
            return;
        }

        try {
            // Optimistic
            setConversations([]);

            const res = await fetch('/api/messages/clear-all', {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                setConversations(initialConversations);
                alert('Error al eliminar los mensajes');
            }
        } catch (error) {
            console.error(error);
            setConversations(initialConversations);
            alert('Error al procesar la solicitud');
        }
    };

    if (conversations.length === 0) {
        // ... empty state logic
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No hay mensajes</h3>
                <p className="text-muted-foreground">
                    Tus conversaciones con instructores o estudiantes aparecerán aquí.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteAll}
                    className="gap-2"
                >
                    <Trash2 className="h-4 w-4" />
                    Limpiar Todo
                </Button>
            </div>

            <div className="grid gap-4">
                {conversations.map((conversation) => (
                    <div key={conversation.id} className="relative group">
                        <Link href={`/dashboard/messages/${conversation.id}`}>
                            <Card className="transition-all hover:bg-blue-50/50 hover:border-blue-200 border-blue-100/50 shadow-sm hover:shadow-md pr-12">
                                <CardContent className="flex items-center gap-4 p-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={conversation.otherUser.image || ''} />
                                        <AvatarFallback>
                                            {conversation.otherUser.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold truncate">
                                                {conversation.otherUser.name}
                                            </h4>
                                            {conversation.lastMessage && (
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(conversation.lastMessage.createdAt), 'dd MMM HH:mm', {
                                                        locale: es,
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm text-muted-foreground truncate">
                                                {conversation.lastMessage
                                                    ? conversation.lastMessage.text
                                                    : 'Inicia una conversación...'}
                                            </p>
                                            <Badge variant="outline" className="ml-2 shrink-0">
                                                {format(new Date(conversation.bookingDate), 'dd/MM/yyyy')}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => handleDelete(e, conversation.id)}
                            title="Eliminar historial"
                        >
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
