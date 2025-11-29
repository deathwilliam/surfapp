import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface InstructorCardProps {
    instructor: {
        id: string;
        name: string;
        image: string | null;
        bio: string | null;
        hourlyRate: number;
        rating: number;
        reviewCount: number;
        specialties: string[];
        locations: string[];
    };
}

export function InstructorCard({ instructor }: InstructorCardProps) {
    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/10">
                            <AvatarImage src={instructor.image || ''} alt={instructor.name} />
                            <AvatarFallback className="text-lg">
                                {instructor.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-heading text-lg font-semibold">
                                {instructor.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{instructor.locations.join(', ')}</span>
                            </div>
                            <div className="mt-1 flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{instructor.rating.toFixed(1)}</span>
                                <span className="text-muted-foreground">
                                    ({instructor.reviewCount} reseñas)
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                            ${instructor.hourlyRate}
                        </div>
                        <div className="text-xs text-muted-foreground">/hora</div>
                    </div>
                </div>

                <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                    {instructor.bio || 'Sin biografía disponible.'}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {instructor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="font-normal">
                            {specialty}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4">
                <Link href={`/instructor/${instructor.id}`} className="w-full">
                    <Button className="w-full">Ver Perfil</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
