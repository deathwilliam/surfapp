import { BookingStatus } from '@prisma/client';
import { Badge } from '@/components/ui/badge';

interface BookingStatusBadgeProps {
    status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
    const statusConfig = {
        [BookingStatus.pending]: {
            label: 'Pendiente',
            className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        },
        [BookingStatus.confirmed]: {
            label: 'Confirmada',
            className: 'bg-green-100 text-green-800 border-green-300',
        },
        [BookingStatus.cancelled]: {
            label: 'Cancelada',
            className: 'bg-red-100 text-red-800 border-red-300',
        },
        [BookingStatus.completed]: {
            label: 'Completada',
            className: 'bg-blue-100 text-blue-800 border-blue-300',
        },
        [BookingStatus.no_show]: {
            label: 'No Show',
            className: 'bg-gray-100 text-gray-800 border-gray-300',
        },
    };

    const config = statusConfig[status];

    return (
        <Badge variant=\"outline\" className={config.className}>
    { config.label }
        </Badge >
    );
}
