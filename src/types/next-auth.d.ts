import { UserType } from '@prisma/client';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            firstName: string;
            lastName: string;
            phone?: string | null;
            userType: UserType;
            image?: string | null;
        };
    }

    interface User {
        id: string;
        email: string;
        name: string;
        firstName: string;
        lastName: string;
        phone?: string | null;
        userType: UserType;
        image?: string | null;
        emailVerified?: Date | null;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        userType: UserType;
        firstName: string;
        lastName: string;
        phone?: string | null;
    }
}
