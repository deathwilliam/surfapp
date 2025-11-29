import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Mail, Phone, Calendar, User } from 'lucide-react';

async function getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            profileImageUrl: true,
            userType: true,
            createdAt: true,
            emailVerified: true,
        },
    });

    return user;
}

export default async function ProfilePage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect('/login');
    }

    const user = await getUserProfile(session.user.id);

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="container py-10">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="font-heading text-3xl font-bold">Mi Perfil</h1>
                    <Link href="/profile/edit">
                        <Button>Editar Perfil</Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Profile Card */}
                    <Card className="md:col-span-1">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                    <AvatarImage
                                        src={user.profileImageUrl || ''}
                                        alt={`${user.firstName} ${user.lastName}`}
                                    />
                                    <AvatarFallback className="text-4xl">
                                        {user.firstName[0]}
                                        {user.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="mt-4 font-heading text-2xl font-bold">
                                    {user.firstName} {user.lastName}
                                </h2>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {user.userType}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Information Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Información Personal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>

                            {user.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Teléfono</p>
                                        <p className="text-sm text-muted-foreground">{user.phone}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Miembro desde</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Estado de verificación</p>
                                    <p className="text-sm text-muted-foreground">
                                        {user.emailVerified ? (
                                            <span className="text-green-600">✓ Email verificado</span>
                                        ) : (
                                            <span className="text-yellow-600">Pendiente de verificación</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
