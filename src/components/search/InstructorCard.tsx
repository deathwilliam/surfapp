import Link from 'next/link';
import { Star, MapPin, Award } from 'lucide-react';
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
        <Card className="group overflow-hidden transition-all hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1">
            {/* Gradient Top Border */}
            <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>

            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                        <div className="relative">
                            <Avatar className="h-16 w-16 border-2 border-cyan-500/20 ring-2 ring-cyan-500/10">
                                <AvatarImage src={instructor.image || ''} alt={instructor.name} />
                                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-lg text-white">
                                    {instructor.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            {/* Verified Badge */}
                            <div className="absolute -bottom-1 -right-1 rounded-full bg-cyan-500 p-1">
                                <Award className="h-3 w-3 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-heading text-lg font-semibold group-hover:text-cyan-600 transition-colors">
                                {instructor.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{instructor.locations.join(', ') || 'El Salvador'}</span>
                            </div>
                            <div className="mt-1 flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{instructor.rating.toFixed(1)}</span>
                                <span className="text-sm text-muted-foreground">
                                    ({instructor.reviewCount})
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                            ${instructor.hourlyRate}
                        </div>
                        <div className="text-xs text-muted-foreground">/hora</div>
                    </div>
                </div>

                <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                    {instructor.bio || 'Instructor certificado de surf con experiencia.'}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {instructor.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="font-normal bg-cyan-50 text-cyan-700 hover:bg-cyan-100">
                            {specialty}
                        </Badge>
                    ))}
                    {instructor.specialties.length > 3 && (
                        <Badge variant="secondary" className="font-normal">
                            +{instructor.specialties.length - 3}
                        </Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-cyan-50/50 to-blue-50/50 p-4">
                <Link href={`/instructor/${instructor.id}`} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                        Ver Perfil
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
