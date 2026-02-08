import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn('animate-pulse rounded-md bg-muted', className)}
            {...props}
        />
    );
}

// Card Skeleton
export function CardSkeleton() {
    return (
        <div className="rounded-lg border bg-card p-6 space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
            </div>
        </div>
    );
}

// Instructor Card Skeleton
export function InstructorCardSkeleton() {
    return (
        <div className="rounded-lg border bg-card overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
}

// Table Skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-10 w-20" />
                </div>
            ))}
        </div>
    );
}

// Avatar Skeleton
export function AvatarSkeleton() {
    return <Skeleton className="h-10 w-10 rounded-full" />;
}

// Text Skeleton
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        'h-4',
                        i === lines - 1 ? 'w-4/5' : 'w-full'
                    )}
                />
            ))}
        </div>
    );
}

// Beach Card Skeleton - for landing page locations
export function BeachCardSkeleton() {
    return (
        <div className="rounded-lg border-2 bg-card overflow-hidden">
            <div className="relative h-48">
                <Skeleton className="absolute inset-0 rounded-none" />
            </div>
            <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center gap-2 mt-4">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
        </div>
    );
}

// Beach Cards Grid Skeleton
export function BeachGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <BeachCardSkeleton key={i} />
            ))}
        </div>
    );
}
