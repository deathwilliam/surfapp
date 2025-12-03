import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { deleteLocation } from './actions';

export default async function AdminLocationsPage() {
    const session = await auth();
    if (session?.user?.userType !== 'admin') {
        redirect('/dashboard');
    }

    const locations = await prisma.location.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ubicaciones</h1>
                    <p className="text-muted-foreground">
                        Gestiona las ubicaciones disponibles para las clases de surf.
                    </p>
                </div>
                <Link href="/dashboard/admin/locations/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Ubicación
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Ciudad</TableHead>
                            <TableHead>País</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {locations.map((location) => (
                            <TableRow key={location.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        {location.name}
                                    </div>
                                </TableCell>
                                <TableCell>{location.city}</TableCell>
                                <TableCell>{location.country}</TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${location.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {location.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/dashboard/admin/locations/${location.id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <form action={async () => {
                                            'use server';
                                            await deleteLocation(location.id);
                                        }}>
                                            <Button variant="ghost" size="icon" className="text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {locations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No hay ubicaciones registradas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
