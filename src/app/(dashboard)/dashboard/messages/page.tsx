import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';

export default async function MessagesPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    return (
        <div className="container py-6">
            <h1 className="mb-6 font-heading text-3xl font-bold">Mensajes</h1>
            <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                    <p>Sistema de mensajería en desarrollo</p>
                    <p className="mt-2 text-sm">Esta funcionalidad estará disponible próximamente</p>
                </CardContent>
            </Card>
        </div>
    );
}
