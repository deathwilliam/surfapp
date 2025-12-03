'use client';

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Instructor {
    id: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        profileImageUrl: string | null;
    };
    experience: number;
    certifications: string[];
    isVerified: boolean;
}

export default function AdminInstructorsPage() {
    const router = useRouter();
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const response = await fetch('/api/admin/users?type=instructor');
            if (response.ok) {
                const data = await response.json();
                // Filter for instructors who have a profile but might need verification
                // Note: The API returns users, we need to map to instructor profiles if possible
                // For this MVP, we'll assume the API returns users with instructor profiles included
                // But wait, the current /api/admin/users returns User objects.
                // We might need to enhance that API or fetch differently.
                // Let's assume for now we filter client side or the API was updated.
                // Actually, let's use the data we have.
                setInstructors(data.filter((u: any) => u.instructorProfile).map((u: any) => ({
                    id: u.instructorProfile.id,
                    user: u,
                    experience: u.instructorProfile.experience,
                    certifications: u.instructorProfile.certifications,
                    isVerified: u.instructorProfile.isVerified
                })));
            }
        } catch (error) {
            console.error('Error fetching instructors:', error);
        } finally {
            setLoading(false);
        }
    };

    const verifyInstructor = async (id: string, verified: boolean) => {
        setProcessingId(id);
        try {
            const response = await fetch(`/api/admin/instructors/${id}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verified }),
            });

            if (!response.ok) throw new Error('Error al actualizar estado');

            toast.success(verified ? 'Instructor verificado' : 'Verificación rechazada');
            fetchInstructors();
            router.refresh();
        } catch (error) {
            toast.error('Error al procesar la solicitud');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Verificación de Instructores</h1>
                <p className="text-muted-foreground">
                    Revisa y verifica los perfiles de instructores.
                </p>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Instructor</TableHead>
                            <TableHead>Experiencia</TableHead>
                            <TableHead>Certificaciones</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {instructors.map((instructor) => (
                            <TableRow key={instructor.id}>
                                <TableCell className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={instructor.user.profileImageUrl || ''} />
                                        <AvatarFallback>{instructor.user.firstName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{instructor.user.firstName} {instructor.user.lastName}</div>
                                        <div className="text-sm text-muted-foreground">{instructor.user.email}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{instructor.experience} años</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {instructor.certifications.map((cert, i) => (
                                            <Badge key={i} variant="outline" className="text-xs">
                                                {cert}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={instructor.isVerified ? 'default' : 'secondary'}>
                                        {instructor.isVerified ? 'Verificado' : 'Pendiente'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {!instructor.isVerified && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                onClick={() => verifyInstructor(instructor.id, true)}
                                                disabled={!!processingId}
                                            >
                                                {processingId === instructor.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Check className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
