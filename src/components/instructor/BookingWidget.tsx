'use client';

import { useState } from 'react';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { BookingModal } from '@/components/booking/BookingModal';

interface TimeSlot {
    id: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    isAvailable: boolean;
    maxStudents: number;
    currentBookings: number;
}

interface BookingWidgetProps {
    slots: TimeSlot[];
    instructor: {
        id: string;
        name: string;
        hourlyRate: number;
    };
}

export function BookingWidget({ slots, instructor }: BookingWidgetProps) {
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectSlot = (slot: TimeSlot) => {
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    return (
        <>
            <AvailabilityCalendar slots={slots} onSelectSlot={handleSelectSlot} />
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                slot={selectedSlot}
                instructor={instructor}
            />
        </>
    );
}
