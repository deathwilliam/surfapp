'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Message {
    id: string;
    messageText: string;
    senderId: string;
    createdAt: string;
    sender: {
        firstName: string;
        lastName: string;
        profileImageUrl: string | null;
    };
}

export default function ChatPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const bookingId = params.id;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch(`/api/messages?bookingId=${bookingId}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchMessages();
            // Poll for new messages every 5 seconds
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [session, bookingId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsSending(true);
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                    messageText: newMessage,
                }),
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return <div className="flex h-[50vh] items-center justify-center">Cargando chat...</div>;
    }

    return (
        <div className="container max-w-3xl py-10">
            <Card className="flex h-[70vh] flex-col">
                <CardHeader className="border-b">
                    <CardTitle>Chat de la Clase</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col p-0">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                No hay mensajes aún. ¡Saluda! 👋
                            </div>
                        ) : (
                            messages.map((message) => {
                                const isMe = message.senderId === session?.user?.id;
                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`flex max-w-[80%] gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'
                                                }`}
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={message.sender.profileImageUrl || ''}
                                                />
                                                <AvatarFallback>
                                                    {message.sender.firstName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div
                                                className={`rounded-lg p-3 ${isMe
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                    }`}
                                            >
                                                <p className="text-sm">{message.messageText}</p>
                                                <p
                                                    className={`mt-1 text-[10px] ${isMe
                                                            ? 'text-primary-foreground/70'
                                                            : 'text-muted-foreground'
                                                        }`}
                                                >
                                                    {format(new Date(message.createdAt), 'HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t p-4">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                disabled={isSending}
                            />
                            <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
