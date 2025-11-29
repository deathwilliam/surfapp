import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, ShieldCheck } from 'lucide-react';

interface InstructorHeaderProps {
    instructor: {
        name: string;
        image: string | null;
        locations: string[];
        rating: number;
        reviewCount: number;
        specialties: string[];
        isVerified: boolean;
    };
}

export function InstructorHeader({ instructor }: InstructorHeaderProps) {
    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg md:h-40 md:w-40">
                <AvatarImage src={instructor.image || ''} alt={instructor.name} />
                <AvatarFallback className="text-4xl">
                    {instructor.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="font-heading text-3xl font-bold">{instructor.name}</h1>
                        {instructor.isVerified && (
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{instructor.locations.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-foreground">
                                {instructor.rating.toFixed(1)}
                            </span>
                            <span>({instructor.reviewCount} reseñas)</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                            {specialty}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
