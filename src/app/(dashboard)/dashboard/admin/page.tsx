import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, Shield } from 'lucide-react';

async function getAdminStats() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/stats`, {
        cache: 'no-store',
    });
    if (!response.ok) return null;
    return response.json();
}

export default async function AdminDashboardPage() {
    const session = await auth();

    if (!session || !session.user || session.user.userType !== 'admin') {
        redirect('/login');
    }

    const stats = await getAdminStats();

    if (!stats) {
        return <div>Error loading stats</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Bienvenido al panel de administración de SurfConnect.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.users.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.users.students} estudiantes, {stats.users.instructors} instructores
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.bookings.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.bookings.completed} completadas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.revenue.total}</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% desde el mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Instructores Pendientes</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.users.pendingInstructors || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Requieren verificación
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
