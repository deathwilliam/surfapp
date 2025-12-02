import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, ShieldCheck, Award } from 'lucide-react';

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
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-50 p-8">
            {/* Decorative Wave Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlcyIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI1MCI+PHBhdGggZD0iTTAgMjVRMjUgMCA1MCAyNVQxMDAgMjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwYWNjMSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3dhdmVzKSIvPjwvc3ZnPg==')]"></div>
            </div>

            <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-xl ring-4 ring-cyan-500/20 md:h-40 md:w-40">
                        <AvatarImage src={instructor.image || ''} alt={instructor.name} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-4xl text-white">
                            {instructor.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .substring(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    {instructor.isVerified && (
                        <div className="absolute -bottom-2 -right-2 rounded-full bg-cyan-500 p-2 shadow-lg ring-4 ring-white">
                            <Award className="h-5 w-5 text-white" />
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-heading text-3xl font-bold md:text-4xl">{instructor.name}</h1>
                            {instructor.isVerified && (
                                <div className="flex items-center gap-1 rounded-full bg-cyan-500 px-3 py-1 text-xs font-medium text-white">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Verificado
                                </div>
                            )}
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-cyan-600" />
                                <span className="font-medium">{instructor.locations.join(', ')}</span>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-bold text-foreground">
                                    {instructor.rating.toFixed(1)}
                                </span>
                                <span className="text-sm">({instructor.reviewCount} reseñas)</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {instructor.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="bg-white shadow-sm hover:bg-cyan-50 hover:text-cyan-700">
                                {specialty}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
