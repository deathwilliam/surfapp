'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Location } from '@prisma/client';
import { Loader2, Save, Plus } from 'lucide-react';

const locationSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
    state: z.string().optional(),
    country: z.string().min(2, 'El país debe tener al menos 2 caracteres'),
    latitude: z.string().refine((val) => !isNaN(parseFloat(val)), {
        message: "Latitud inválida",
    }),
    longitude: z.string().refine((val) => !isNaN(parseFloat(val)), {
        message: "Longitud inválida",
    }),
    description: z.string().optional(),
    imageUrl: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
    isActive: z.boolean(),
});

export type LocationFormData = z.infer<typeof locationSchema>;

interface LocationFormProps {
    initialData?: Location | null;
    onSubmit: (data: LocationFormData) => Promise<void>;
    isLoading: boolean;
}

export function LocationForm({ initialData, onSubmit, isLoading }: LocationFormProps) {
    const form = useForm<LocationFormData>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            name: initialData?.name || '',
            address: initialData?.address || '',
            city: initialData?.city || '',
            state: initialData?.state || '',
            country: initialData?.country || '',
            latitude: initialData?.latitude ? String(initialData.latitude) : '',
            longitude: initialData?.longitude ? String(initialData.longitude) : '',
            description: initialData?.description || '',
            imageUrl: initialData?.imageUrl || '',
            isActive: initialData?.isActive ?? true,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: El Tunco" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ciudad</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: La Libertad" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado/Provincia (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: La Libertad" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>País</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: El Salvador" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Dirección Completa</FormLabel>
                                <FormControl>
                                    <Input placeholder="Dirección exacta..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Latitud</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: 13.4939" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Longitud</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: -89.3847" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>URL de Imagen (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Descripción (Opcional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Descripción del lugar..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:col-span-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Activo
                                    </FormLabel>
                                    <FormDescription>
                                        Si está desactivado, no aparecerá en las búsquedas.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : initialData ? (
                        <Save className="mr-2 h-4 w-4" />
                    ) : (
                        <Plus className="mr-2 h-4 w-4" />
                    )}
                    {initialData ? 'Actualizar Ubicación' : 'Crear Ubicación'}
                </Button>
            </form>
        </Form>
    );
}
