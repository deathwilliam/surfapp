import { z } from 'zod';
import { UserType } from '@prisma/client';

// Login Schema
export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register Schema
export const registerSchema = z
    .object({
        email: z.string().email('Email inválido'),
        password: z
            .string()
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
            ),
        confirmPassword: z.string(),
        firstName: z
            .string()
            .min(2, 'El nombre debe tener al menos 2 caracteres')
            .max(100, 'El nombre no puede exceder 100 caracteres'),
        lastName: z
            .string()
            .min(2, 'El apellido debe tener al menos 2 caracteres')
            .max(100, 'El apellido no puede exceder 100 caracteres'),
        phone: z
            .string()
            .regex(/^\+?[0-9\s-()]+$/, 'Número de teléfono inválido')
            .optional()
            .or(z.literal('')),
        userType: z.nativeEnum(UserType),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

export type RegisterInput = z.infer<typeof registerSchema>;

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
    email: z.string().email('Email inválido'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Reset Password Schema
export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
