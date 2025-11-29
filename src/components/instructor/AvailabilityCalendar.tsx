'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <Card>
                <CardHeader>
                    <CardTitle>Selecciona una fecha</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
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
                        className="rounded-md border"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {date ? format(date, "d 'de' MMMM", { locale: es }) : 'Horarios'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                        {dailySlots.length > 0 ? (
                            dailySlots.map((slot) => (
                                <Button
                                    key={slot.id}
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => onSelectSlot(slot)}
                                >
                                    {format(new Date(slot.startTime), 'HH:mm')}
                                </Button>
                            ))
                        ) : (
                            <p className="col-span-2 text-center text-sm text-muted-foreground">
                                No hay horarios disponibles para esta fecha.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
