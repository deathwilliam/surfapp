'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format, startOfDay, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loader2, Trash2, Plus } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    location: {
        id: string;
        name: string;
    };
}

interface Location {
    id: string;
    name: string;
}

interface AvailabilityManagerProps {
    locations: Location[];
}

export function AvailabilityManager({ locations }: AvailabilityManagerProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // New slot state
    const [startHour, setStartHour] = useState('09:00');
    const [duration, setDuration] = useState('60'); // minutes
    const [locationId, setLocationId] = useState<string>(locations[0]?.id || '');

    useEffect(() => {
        if (date) {
            fetchSlots(date);
        }
    }, [date]);

    async function fetchSlots(selectedDate: Date) {
        setIsLoading(true);
        try {
            const start = startOfDay(selectedDate).toISOString();
            const end = startOfDay(addDays(selectedDate, 1)).toISOString();

            const response = await fetch(
                `/api/instructor/availability?start=${start}&end=${end}`
            );

            if (!response.ok) throw new Error('Error al cargar horarios');

            const data = await response.json();
            setSlots(data);
        } catch (error) {
            toast.error('Error al cargar disponibilidad');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAddSlot() {
        if (!date || !locationId) return;
        setIsSaving(true);

        try {
            const [hours, minutes] = startHour.split(':').map(Number);
            const endTime = new Date();
            endTime.setHours(hours, minutes + parseInt(duration), 0, 0);
            const endHourStr = format(endTime, 'HH:mm');

            const response = await fetch('/api/instructor/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: format(date, 'yyyy-MM-dd'),
                    locationId,
                    timeSlots: [
                        {
                            startTime: startHour,
                            endTime: endHourStr,
                        },
                    ],
                }),
            });

            if (!response.ok) throw new Error('Error al crear horario');

            toast.success('Horario agregado');
            fetchSlots(date);
        } catch (error) {
            toast.error('Error al guardar horario');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteSlot(id: string) {
        try {
            const response = await fetch(`/api/instructor/availability?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al eliminar');
            }

            toast.success('Horario eliminado');
            if (date) fetchSlots(date);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al eliminar');
        }
    }

    // Generate time options (06:00 to 20:00)
    const timeOptions = [];
    for (let i = 6; i <= 20; i++) {
        const hour = i.toString().padStart(2, '0');
        timeOptions.push(`${hour}:00`);
        timeOptions.push(`${hour}:30`);
    }

    return (
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <Card>
                <CardContent className="p-4">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                        disabled={(date) => date < startOfDay(new Date())}
                    />
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {date ? format(date, "d 'de' MMMM, yyyy", { locale: es }) : 'Selecciona una fecha'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-wrap items-end gap-4 rounded-lg border p-4 bg-muted/50">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ubicación</label>
                                <Select value={locationId} onValueChange={setLocationId}>
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map((location) => (
                                            <SelectItem key={location.id} value={location.id}>
                                                {location.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hora Inicio</label>
                                <Select value={startHour} onValueChange={setStartHour}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeOptions.map((time) => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Duración</label>
                                <Select value={duration} onValueChange={setDuration}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="60">1 Hora</SelectItem>
                                        <SelectItem value="90">1.5 Horas</SelectItem>
                                        <SelectItem value="120">2 Horas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button onClick={handleAddSlot} disabled={!date || !locationId || isSaving}>
                                {isSaving ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="mr-2 h-4 w-4" />
                                )}
                                Agregar Horario
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-medium">Horarios Disponibles</h4>
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : slots.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No hay horarios configurados para este día.
                                </p>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {slots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`flex items-center justify-between rounded-md border p-3 ${!slot.isAvailable ? 'bg-muted opacity-50' : 'bg-card'
                                                }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {format(new Date(slot.startTime), 'HH:mm')} -{' '}
                                                    {format(new Date(slot.endTime), 'HH:mm')}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {slot.location.name}
                                                </span>
                                                {!slot.isAvailable && (
                                                    <span className="text-xs text-primary font-medium">
                                                        Reservado
                                                    </span>
                                                )}
                                            </div>
                                            {slot.isAvailable && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive/90"
                                                    onClick={() => handleDeleteSlot(slot.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
