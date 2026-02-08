'use client';

import Script from 'next/script';

// Google Analytics 4 Component
// Replace GA_MEASUREMENT_ID with your actual ID from Google Analytics

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export function GoogleAnalytics() {
    if (!GA_MEASUREMENT_ID || process.env.NODE_ENV !== 'production') {
        return null;
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
            </Script>
        </>
    );
}

// Event tracking helper
export function trackEvent(action: string, category: string, label?: string, value?: number) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}

// Common event trackers
export const analytics = {
    bookingStarted: (instructorId: string) =>
        trackEvent('booking_started', 'engagement', instructorId),
    bookingCompleted: (instructorId: string, value?: number) =>
        trackEvent('booking_completed', 'conversion', instructorId, value),
    searchPerformed: (filters: string) =>
        trackEvent('search', 'engagement', filters),
    profileViewed: (instructorId: string) =>
        trackEvent('profile_view', 'engagement', instructorId),
    languageChanged: (language: string) =>
        trackEvent('language_change', 'settings', language),
};
