'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ReviewModalProps {
    bookingId: string;
    instructorName: string;
    children: React.ReactNode;
}

export function ReviewModal({ bookingId, instructorName, children }: ReviewModalProps) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                    rating,
                    comment,
                }),
            });

            if (response.ok) {
                setOpen(false);
                router.refresh();
            } else {
                const data = await response.json();
                alert(data.error || 'Error al enviar reseña');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error al enviar reseña');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Calificar a {instructorName}</DialogTitle>
                    <DialogDescription>
                        ¿Qué tal estuvo tu clase? Tu opinión ayuda a otros estudiantes.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                            >
                                <Star
                                    className={`h-8 w-8 ${star <= rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-muted-foreground/30'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    <Textarea
                        placeholder="Escribe un comentario (opcional)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={rating === 0 || isSubmitting}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
