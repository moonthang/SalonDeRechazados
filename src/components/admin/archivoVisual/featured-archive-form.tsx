'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Config } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  featuredArchiveVideoUrl: z.string().url('Debe ser una URL válida para el video.').or(z.literal('')),
});

type FeaturedArchiveFormData = z.infer<typeof formSchema>;

interface FeaturedArchiveFormProps {
    onSuccess?: () => void;
}

export default function FeaturedArchiveForm({ onSuccess }: FeaturedArchiveFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const router = useRouter();

  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'main');
  }, [firestore]);

  const { data: config, isLoading: isConfigLoading } = useDoc<Config>(configRef);

  const form = useForm<FeaturedArchiveFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      featuredArchiveVideoUrl: '',
    },
  });
  
  useEffect(() => {
    if (config?.featuredArchiveVideoUrl) {
      form.reset({ featuredArchiveVideoUrl: config.featuredArchiveVideoUrl });
    } else {
      form.reset({ featuredArchiveVideoUrl: '' });
    }
  }, [config, form]);


  async function onSubmit(values: FeaturedArchiveFormData) {
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
        featuredArchiveVideoUrl: values.featuredArchiveVideoUrl || null,
    };

    setDoc(configRef, dataToSave, { merge: true }).then(() => {
        toast({ title: 'Éxito', description: 'Video destacado del archivo actualizado.' });
        if (onSuccess) {
            onSuccess();
        } else {
            router.push('/admin/archivoVisual/featured-archive');
        }
    }).catch((err: any) => {
        if (err.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: 'config/main',
                operation: 'update',
                requestResourceData: dataToSave,
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
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="featuredArchiveVideoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del Video Destacado</FormLabel>
                <FormControl><Input placeholder="https://www.youtube.com/watch?v=..." {...field} /></FormControl>
                <FormDescription>Pega la URL de YouTube aquí. Déjalo en blanco para mostrar la imagen por defecto.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
        />
        <Button type="submit" disabled={loading} size="lg">
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </form>
    </Form>
  );
}
