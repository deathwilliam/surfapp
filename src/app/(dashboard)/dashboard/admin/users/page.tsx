import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

async function getUsers() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/users`, {
        cache: 'no-store',
    });
    if (!response.ok) return [];
    return response.json();
}

export default async function AdminUsersPage() {
    const session = await auth();

    if (!session || !session.user || session.user.userType !== 'admin') {
        redirect('/login');
    }

    const users = await getUsers();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                <p className="text-muted-foreground">
                    Administra los usuarios de la plataforma.
                </p>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha Registro</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user: any) => (
                            <TableRow key={user.id}>
                                <TableCell className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.profileImageUrl} />
                                        <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.userType === 'instructor' ? 'default' : 'secondary'}>
                                        {user.userType}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Activo
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(user.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
