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
import { MapPin, DollarSign, TrendingUp, Filter, X } from 'lucide-react';

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
        <div className="sticky top-24 space-y-6 rounded-lg border border-cyan-200 bg-white shadow-lg">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 text-white">
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    <h3 className="font-heading text-lg font-semibold">Filtros</h3>
                </div>
                <p className="mt-1 text-sm text-blue-50">
                    Encuentra tu instructor ideal
                </p>
            </div>

            <div className="space-y-8 p-6 pt-0">
                {/* Location Filter */}
                <div className="space-y-2 mb-4">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="h-4 w-4 text-cyan-600" />
                        Ubicación
                    </Label>
                    <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger className="border-cyan-200 focus:ring-cyan-500">
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
                <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                        <DollarSign className="h-4 w-4 text-cyan-600" />
                        Precio por hora
                    </Label>
                    <div className="rounded-lg bg-cyan-50/50 p-4">
                        <Slider
                            defaultValue={[0, 100]}
                            value={priceRange}
                            min={0}
                            max={100}
                            step={5}
                            onValueChange={setPriceRange}
                            className="[&_[role=slider]]:bg-cyan-600 [&_[role=slider]]:border-cyan-600"
                        />
                        <div className="mt-3 flex justify-between text-sm font-medium">
                            <span className="rounded-md bg-white px-2 py-1 shadow-sm">${priceRange[0]}</span>
                            <span className="rounded-md bg-white px-2 py-1 shadow-sm">${priceRange[1]}</span>
                        </div>
                    </div>
                </div>

                {/* Level Filter */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                        <TrendingUp className="h-4 w-4 text-cyan-600" />
                        Nivel
                    </Label>
                    <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger className="border-cyan-200 focus:ring-cyan-500">
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
                    <Button
                        onClick={applyFilters}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Aplicar Filtros
                    </Button>
                    <Button variant="outline" onClick={clearFilters} className="border-cyan-200 hover:bg-cyan-50">
                        <X className="mr-2 h-4 w-4" />
                        Limpiar
                    </Button>
                </div>
            </div>
        </div>
    );
}
