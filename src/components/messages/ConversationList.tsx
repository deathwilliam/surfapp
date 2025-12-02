'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

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

export function ConversationList({ conversations }: ConversationListProps) {
    if (conversations.length === 0) {
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
        <div className="grid gap-4">
            {conversations.map((conversation) => (
                <Link key={conversation.id} href={`/bookings/${conversation.id}/chat`}>
                    <Card className="transition-all hover:bg-blue-50/50 hover:border-blue-200 border-blue-100/50 shadow-sm hover:shadow-md">
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
            ))}
        </div>
    );
}
