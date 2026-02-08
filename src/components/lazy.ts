// Lazy loaded components for better bundle splitting
// Use these imports for components that are not needed immediately

import dynamic from 'next/dynamic';

// Modals - only load when user interacts
export const LazyBookingModal = dynamic(
    () => import('@/components/booking/BookingModal').then(mod => ({ default: mod.BookingModal })),
    { ssr: false }
);

// Chat components - only for authenticated users
export const LazyChatWindow = dynamic(
    () => import('@/components/messages/ChatWindow'),
    { ssr: false }
);

// Calendar - heavy component
export const LazyAvailabilityCalendar = dynamic(
    () => import('@/components/instructor/AvailabilityCalendar').then(mod => ({ default: mod.AvailabilityCalendar })),
    {
        ssr: false,
        loading: () => (
            <div className= "animate-pulse bg-muted rounded-lg h-[400px]" />
    ),
  }
);

// Review form - only on profile pages
export const LazyReviewForm = dynamic(
    () => import('@/components/reviews/ReviewForm'),
    { ssr: false }
);
