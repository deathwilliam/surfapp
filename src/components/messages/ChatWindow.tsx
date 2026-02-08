'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Send } from 'lucide-react';

interface Message {
    id: string;
    senderId: string;
    messageText: string;
    createdAt: string;
    sender: {
        firstName: string;
        lastName: string;
        profileImageUrl: string | null;
    };
}

interface ChatWindowProps {
    bookingId: string;
    otherUserName: string;
}

export function ChatWindow({ bookingId, otherUserName }: ChatWindowProps) {
    // console.log('[ChatWindow] Received props:', { bookingId, otherUserName });
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/messages?bookingId=${bookingId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const markAsRead = async () => {
        try {
            await fetch('/api/messages/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId }),
            });
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [bookingId]);

    useEffect(() => {
        scrollToBottom();
        if (messages.length > 0) {
            markAsRead();
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageToSend = newMessage;
        setNewMessage(''); // Clear immediately for better UX
        setIsLoading(true);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                    messageText: messageToSend,
                }),
            });

            if (res.ok) {
                fetchMessages(); // Refresh immediately
            } else {
                const error = await res.json();
                console.error('Error sending message:', error);
                alert('Error al enviar mensaje: ' + (error.error || 'Error desconocido'));
                setNewMessage(messageToSend); // Restore message on error
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error al enviar mensaje. Por favor intenta de nuevo.');
            setNewMessage(messageToSend); // Restore message on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!session) return <div>Inicia sesión para ver los mensajes.</div>;

    return (
        <Card className="flex h-[500px] flex-col">
            <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    {messages.map((message) => {
                        const isMe = message.senderId === session.user?.id;
                        return (
                            <div
                                key={message.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`flex max-w-[80%] items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'
                                        }`}
                                >
                                    {!isMe && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={message.sender.profileImageUrl || undefined}
                                            />
                                            <AvatarFallback>
                                                {message.sender.firstName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div
                                        className={`rounded-lg px-4 py-2 ${isMe
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                            }`}
                                    >
                                        <p className="text-sm">{message.messageText}</p>
                                        <p className={`mt-1 text-[10px] ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                            {format(new Date(message.createdAt), 'HH:mm', {
                                                locale: es,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </CardContent>
            <CardFooter className="border-t p-3">
                <div className="flex w-full gap-2">
                    <Textarea
                        placeholder="Escribe un mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="min-h-[40px] resize-none"
                        rows={1}
                    />
                    <Button
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={isLoading || !newMessage.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
