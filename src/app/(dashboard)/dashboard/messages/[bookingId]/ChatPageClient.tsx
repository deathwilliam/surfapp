'use client';

import { ChatWindow } from '@/components/messages/ChatWindow';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ChatPageClientProps {
    bookingId: string;
    otherUserName: string;
}

export function ChatPageClient({ bookingId, otherUserName }: ChatPageClientProps) {
    // console.log('[ChatPageClient] Received props:', { bookingId, otherUserName });

    return (
        <div className="container py-6">
            <div className="mb-4">
                <Link href="/dashboard/messages">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Mensajes
                    </Button>
                </Link>
            </div>
            <div className="mb-4">
                <h1 className="font-heading text-2xl font-bold text-primary">
                    Chat con {otherUserName}
                </h1>
            </div>
            <ChatWindow bookingId={bookingId} otherUserName={otherUserName} />
        </div>
    );
}
