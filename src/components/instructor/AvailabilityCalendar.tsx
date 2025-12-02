'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarDays, Clock } from 'lucide-react';

interface TimeSlot {
    id: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    isAvailable: boolean;
    maxStudents: number;
    currentBookings: number;
}

interface AvailabilityCalendarProps {
    slots: TimeSlot[];
    onSelectSlot: (slot: TimeSlot) => void;
}

export function AvailabilityCalendar({
    slots,
    onSelectSlot,
}: AvailabilityCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Filter slots for the selected date
    const dailySlots = slots
        .filter(
            (slot) =>
                date &&
                isSameDay(new Date(slot.date), date) &&
                slot.isAvailable &&
                slot.currentBookings < slot.maxStudents &&
                new Date(slot.date) > new Date()
        )
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    // Get days with available slots for highlighting
    const availableDays = slots
        .filter((slot) => slot.isAvailable && slot.currentBookings < slot.maxStudents && new Date(slot.date) > new Date())
        .map((slot) => new Date(slot.date));

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden border-cyan-200">
                <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5" />
                        Selecciona una fecha
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center overflow-x-auto p-6">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={es}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        modifiers={{
                            available: availableDays,
                        }}
                        modifiersStyles={{
                            available: {
                                fontWeight: 'bold',
                                textDecoration: 'underline',
                                color: 'var(--primary)',
                            },
                        }}
                        className="rounded-md border border-cyan-100"
                    />
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-cyan-200">
                <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        {date ? format(date, "d 'de' MMMM", { locale: es }) : 'Horarios'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {dailySlots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                            {dailySlots.map((slot) => (
                                <Button
                                    key={slot.id}
                                    variant="outline"
                                    className="w-full border-cyan-200 hover:bg-cyan-50 hover:border-cyan-500 hover:text-cyan-700 transition-all"
                                    onClick={() => onSelectSlot(slot)}
                                >
                                    <Clock className="mr-2 h-4 w-4" />
                                    {format(new Date(slot.startTime), 'HH:mm')}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="mb-3 rounded-full bg-cyan-50 p-3">
                                <Clock className="h-6 w-6 text-cyan-600" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">
                                No hay horarios disponibles para esta fecha.
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Selecciona otra fecha del calendario
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
