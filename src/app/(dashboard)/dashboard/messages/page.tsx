import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { ChatWindow } from '@/components/messaging/ChatWindow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default async function MessagesPage({
    searchParams,
}: {
    searchParams: { bookingId?: string };
}) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const params = await searchParams;
    const selectedBookingId = params.bookingId;

    // Fetch all bookings for the user (as student or instructor)
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            instructorProfile: true,
        },
    });

    if (!user) {
        redirect('/login');
    }

    let bookings;
    if (user.userType === 'student') {
        bookings = await prisma.booking.findMany({
            where: { studentId: user.id },
            include: {
                instructor: {
                    include: { user: true },
                },
                location: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    } else if (user.userType === 'instructor' && user.instructorProfile) {
        bookings = await prisma.booking.findMany({
            where: { instructorId: user.instructorProfile.id },
            include: {
                student: true,
                location: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    } else {
        bookings = [];
    }

    // Get selected booking details
    let selectedBooking = null;
    let otherUserName = '';

    if (selectedBookingId) {
        selectedBooking = bookings.find((b) => b.id === selectedBookingId);
        if (selectedBooking) {
            if (user.userType === 'student') {
                otherUserName = `${selectedBooking.instructor.user.firstName} ${selectedBooking.instructor.user.lastName}`;
            } else {
                otherUserName = `${selectedBooking.student.firstName} ${selectedBooking.student.lastName}`;
            }
        }
    }

    return (
        <div className="container py-6">
            <h1 className="mb-6 font-heading text-3xl font-bold">Mensajes</h1>
            <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
                {/* Conversations List */}
                <div className="space-y-2">
                    <h2 className="mb-4 text-lg font-semibold">Conversaciones</h2>
                    {bookings.length === 0 ? (
                        <Card>
                            <CardContent className="p-6 text-center text-muted-foreground">
                                No tienes conversaciones activas
                            </CardContent>
                        </Card>
                    ) : (
                        bookings.map((booking) => {
                            const otherUser =
                                user.userType === 'student'
                                    ? booking.instructor.user
                                    : booking.student;
                            const lastMessage = booking.messages[0];
                            const isSelected = booking.id === selectedBookingId;

                            return (
                                <Link
                                    key={booking.id}
                                    href={`/dashboard/messages?bookingId=${booking.id}`}
                                >
                                    <Card
                                        className={`cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? 'border-primary bg-muted/50' : ''
                                            }`}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={otherUser.profileImageUrl || undefined}
                                                    />
                                                    <AvatarFallback>
                                                        {otherUser.firstName[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium">
                                                            {otherUser.firstName}{' '}
                                                            {otherUser.lastName}
                                                        </p>
                                                        <Badge variant="outline" className="text-xs">
                                                            {booking.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(
                                                            new Date(booking.bookingDate),
                                                            "d 'de' MMMM",
                                                            { locale: es }
                                                        )}{' '}
                                                        - {booking.location.name}
                                                    </p>
                                                    {lastMessage && (
                                                        <p className="mt-1 truncate text-sm text-muted-foreground">
                                                            {lastMessage.messageText}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })
                    )}
                </div>

                {/* Chat Window */}
                <div>
                    {selectedBooking ? (
                        <ChatWindow
                            bookingId={selectedBooking.id}
                            otherUserName={otherUserName}
                        />
                    ) : (
                        <Card className="flex h-[600px] items-center justify-center">
                            <CardContent className="text-center text-muted-foreground">
                                Selecciona una conversación para comenzar a chatear
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
