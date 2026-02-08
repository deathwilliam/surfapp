import prisma from '@/lib/prisma';

import { Card, CardContent } from '@/components/ui/card';
import { Waves } from 'lucide-react';
import Image from 'next/image';

// Server component to fetch and display beach locations
export async function BeachLocations() {
    const locations = await prisma.location.findMany({
        where: { isActive: true },
        take: 9,
    });

    if (locations.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No hay playas disponibles en este momento.
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
                <Card key={location.id} className="group overflow-hidden border-2 transition-all hover:border-primary hover:shadow-xl">
                    <div className="relative h-48 overflow-hidden">
                        <Image
                            src={location.imageUrl || '/images/placeholder-beach.jpg'}
                            alt={location.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="font-heading text-2xl font-bold text-white drop-shadow-lg">{location.name}</h3>
                            <p className="text-sm text-white/90">{location.city}</p>
                        </div>
                        {location.difficulty && (
                            <div className="absolute top-4 right-4">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${location.difficulty === 'Experto' ? 'bg-red-500' :
                                    location.difficulty === 'Intermedio' ? 'bg-orange-500' :
                                        location.difficulty === 'Principiante' ? 'bg-green-500' :
                                            'bg-blue-500'
                                    }`}>
                                    {location.difficulty}
                                </span>
                            </div>
                        )}
                    </div>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {location.description}
                        </p>
                        {location.surfType && (
                            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                                <Waves className="h-4 w-4" />
                                <span>{location.surfType}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
