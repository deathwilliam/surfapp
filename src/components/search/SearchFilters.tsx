'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { StudentLevel } from '@prisma/client';

interface SearchFiltersProps {
    locations: { id: string; name: string }[];
}

export function SearchFilters({ locations }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [location, setLocation] = useState(searchParams.get('locationId') || 'all');
    const [priceRange, setPriceRange] = useState([
        Number(searchParams.get('minPrice')) || 0,
        Number(searchParams.get('maxPrice')) || 100,
    ]);
    const [level, setLevel] = useState(searchParams.get('level') || 'all');

    // Update local state when URL params change
    useEffect(() => {
        setLocation(searchParams.get('locationId') || 'all');
        setPriceRange([
            Number(searchParams.get('minPrice')) || 0,
            Number(searchParams.get('maxPrice')) || 100,
        ]);
        setLevel(searchParams.get('level') || 'all');
    }, [searchParams]);

    const applyFilters = () => {
        const params = new URLSearchParams();

        if (location && location !== 'all') params.set('locationId', location);
        if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
        if (priceRange[1] < 100) params.set('maxPrice', priceRange[1].toString());
        if (level && level !== 'all') params.set('level', level);

        router.push(`/search?${params.toString()}`);
    };

    const clearFilters = () => {
        setLocation('all');
        setPriceRange([0, 100]);
        setLevel('all');
        router.push('/search');
    };

    return (
        <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
            <div>
                <h3 className="font-heading text-lg font-semibold">Filtros</h3>
                <p className="text-sm text-muted-foreground">
                    Encuentra tu instructor ideal
                </p>
            </div>

            <div className="space-y-4">
                {/* Location Filter */}
                <div className="space-y-2">
                    <Label>Ubicación</Label>
                    <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una playa" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las playas</SelectItem>
                            {locations.map((loc) => (
                                <SelectItem key={loc.id} value={loc.id}>
                                    {loc.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Price Filter */}
                <div className="space-y-2">
                    <Label>Precio por hora ($)</Label>
                    <div className="pt-2">
                        <Slider
                            defaultValue={[0, 100]}
                            value={priceRange}
                            min={0}
                            max={100}
                            step={5}
                            onValueChange={setPriceRange}
                        />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>

                {/* Level Filter */}
                <div className="space-y-2">
                    <Label>Nivel</Label>
                    <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger>
                            <SelectValue placeholder="Cualquier nivel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los niveles</SelectItem>
                            {Object.values(StudentLevel).map((lvl) => (
                                <SelectItem key={lvl} value={lvl}>
                                    {lvl}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                    <Button onClick={applyFilters}>Aplicar Filtros</Button>
                    <Button variant="outline" onClick={clearFilters}>
                        Limpiar
                    </Button>
                </div>
            </div>
        </div>
    );
}
