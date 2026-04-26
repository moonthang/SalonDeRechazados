'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Config } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

const platformSchema = z.object({
  plataforma: z.string().min(1, 'El nombre de la plataforma es requerido.'),
  link: z.string().url('La URL no es válida').optional().or(z.literal('')),
});

const formSchema = z.object({
  movieTitle: z.string().min(1, 'El título es requerido.'),
  director: z.string().min(1, 'El director es requerido.'),
  coverUrl: z.string().url('Debe ser una URL válida para la portada.'),
  videoUrl: z.string().url('Debe ser una URL válida para el video.'),
  description: z.string().optional(),
  watchOn: z.array(platformSchema).min(1, 'Añade al menos una plataforma.'),
});

type FeaturedItemFormData = z.infer<typeof formSchema>;

export default function FeaturedItemForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const router = useRouter();

  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'main');
  }, [firestore]);

  const { data: config, isLoading: isConfigLoading } = useDoc<Config>(configRef);

  const form = useForm<FeaturedItemFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      movieTitle: '',
      director: '',
      coverUrl: '',
      videoUrl: '',
      description: '',
      watchOn: [{ plataforma: '', link: '' }],
    },
  });
  
  useEffect(() => {
    if (config?.featuredItem) {
      form.reset(config.featuredItem);
    }
  }, [config, form]);


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'watchOn',
  });

  async function onSubmit(values: FeaturedItemFormData) {
    setLoading(true);
    
    if(!firestore || !configRef) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Servicio de base de datos no disponible.',
        });
        setLoading(false);
        return;
    }

    const dataToSave = {
        featuredItem: values,
    };

    setDoc(configRef, dataToSave, { merge: true }).then(() => {
        toast({ title: 'Éxito', description: 'Video destacado actualizado.' });
        router.push('/admin/archivoVisual/featured');
    }).catch((err: any) => {
        if (err.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: 'config/main',
                operation: 'update',
                requestResourceData: { 'featuredItem': values },
            });
            errorEmitter.emit('permission-error', permissionError);
        } else {
             toast({ variant: 'destructive', title: 'Error', description: `No se pudo guardar: ${err.message}` });
        }
    }).finally(() => {
        setLoading(false);
    });
  }

  if (isConfigLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="movieTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título de la Película</FormLabel>
              <FormControl><Input placeholder="Título de la película" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="director"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Director/a</FormLabel>
              <FormControl><Input placeholder="Nombre del Director/a" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="coverUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de la Portada</FormLabel>
                <FormControl><Input placeholder="https://image.tmdb.org/..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del Video Ensayo</FormLabel>
                <FormControl><Input placeholder="https://www.youtube.com/watch?v=..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción / Sinopsis</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Añade una breve sinopsis o descripción para la película destacada."
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
            <FormLabel>Disponible en</FormLabel>
            <FormDescription className="mb-4">Plataformas de streaming donde se puede ver la película.</FormDescription>
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-background/50">
                        <FormField
                            control={form.control}
                            name={`watchOn.${index}.plataforma`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Plataforma</FormLabel>
                                    <FormControl><Input placeholder="MUBI" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`watchOn.${index}.link`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Enlace (Opcional)</FormLabel>
                                    <FormControl><Input placeholder="https://mubi.com/..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                            <Trash2 className="h-5 w-5 text-destructive"/>
                            <span className="sr-only">Eliminar plataforma</span>
                        </Button>
                    </div>
                ))}
            </div>
             <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ plataforma: '', link: '' })}
                >
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Plataforma
            </Button>
             <FormMessage>{form.formState.errors.watchOn?.message}</FormMessage>
        </div>

        <Button type="submit" disabled={loading} size="lg">
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </form>
    </Form>
  );
}
