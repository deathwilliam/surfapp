import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    student: {
        firstName: string;
        lastName: string;
        profileImageUrl: string | null;
    };
}

interface ReviewListProps {
    reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>Este instructor aún no tiene reseñas.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6 last:border-0">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={review.student.profileImageUrl || undefined} />
                                <AvatarFallback>
                                    {review.student.firstName[0]}
                                    {review.student.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-sm">
                                    {review.student.firstName} {review.student.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(review.createdAt), {
                                        addSuffix: true,
                                        locale: es,
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground/30'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                    {review.comment && (
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            {review.comment}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
