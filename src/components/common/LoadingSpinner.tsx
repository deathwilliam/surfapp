import { Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className={cn('relative', sizeClasses[size], className)}>
            <Waves className={cn('animate-spin text-primary', sizeClasses[size])} />
        </div>
    );
}

// Full page loading overlay
export function LoadingOverlay({ message }: { message?: string }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#00D4D4] to-[#FF6B35] opacity-20 animate-ping" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Waves className="h-10 w-10 text-primary animate-spin" />
                    </div>
                </div>
                {message && (
                    <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
                )}
            </div>
        </div>
    );
}

// Inline loading state
export function LoadingInline({ message }: { message?: string }) {
    return (
        <div className="flex items-center justify-center gap-3 py-8">
            <LoadingSpinner size="md" />
            {message && <span className="text-sm text-muted-foreground">{message}</span>}
        </div>
    );
}
