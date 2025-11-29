import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Mail, Phone, Calendar, DollarSign, Star, Award, BookOpen } from 'lucide-react';
import { UserType } from '@prisma/client';

async function getInstructorProfile(userId: string) {
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
            instructorProfile: {
                select: {
                    bio: true,
                    experienceYears: true,
                    certifications: true,
                    specialties: true,
                    hourlyRate: true,
                    isVerified: true,
                    averageRating: true,
                    totalReviews: true,
                    totalClasses: true,
                },
            },
        },
    });

    return user;
}

export default async function InstructorProfilePage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect('/login');
    }

    if (session.user.userType !== UserType.instructor) {
        redirect('/profile');
    }

    const user = await getInstructorProfile(session.user.id);

    if (!user || !user.instructorProfile) {
        redirect('/profile');
    }

    const profile = user.instructorProfile;

    return (
        <div className="container py-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="font-heading text-3xl font-bold">Mi Perfil de Instructor</h1>
                    <Link href="/profile/instructor/edit">
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
                                <p className="text-sm text-muted-foreground">Instructor de Surf</p>
                                {profile.isVerified && (
                                    <Badge className="mt-2" variant="default">
                                        ✓ Verificado
                                    </Badge>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Calificación</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold">
                                            {Number(profile.averageRating).toFixed(1)}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            ({profile.totalReviews})
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Clases</span>
                                    <span className="font-semibold">{profile.totalClasses}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Tarifa/hora</span>
                                    <span className="font-semibold text-primary">
                                        ${Number(profile.hourlyRate)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Information Cards */}
                    <div className="space-y-6 md:col-span-2">
                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de Contacto</CardTitle>
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
                                            <p className="text-sm text-muted-foreground">
                                                {user.phone}
                                            </p>
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
                            </CardContent>
                        </Card>

                        {/* Bio */}
                        {profile.bio && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sobre mí</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-line text-muted-foreground">
                                        {profile.bio}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Experience & Certifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Experiencia y Certificaciones</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {profile.experienceYears && (
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Años de experiencia</p>
                                            <p className="text-sm text-muted-foreground">
                                                {profile.experienceYears} años
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {profile.certifications &&
                                    Array.isArray(profile.certifications) &&
                                    profile.certifications.length > 0 && (
                                        <div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <Award className="h-5 w-5 text-muted-foreground" />
                                                <p className="text-sm font-medium">Certificaciones</p>
                                            </div>
                                            <ul className="ml-7 list-disc space-y-1">
                                                {(profile.certifications as string[]).map(
                                                    (cert, index) => (
                                                        <li
                                                            key={index}
                                                            className="text-sm text-muted-foreground"
                                                        >
                                                            {cert}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>

                        {/* Specialties */}
                        {profile.specialties &&
                            Array.isArray(profile.specialties) &&
                            profile.specialties.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Especialidades</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {(profile.specialties as string[]).map(
                                                (specialty, index) => (
                                                    <Badge key={index} variant="secondary">
                                                        {specialty}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
