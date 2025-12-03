import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (session.user.userType !== 'admin') {
        return NextResponse.json({ error: 'Acceso denegado - Se requiere rol de administrador' }, { status: 403 });
    }

    return null; // No error, user is admin
}
