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
  homeBannerUrl: z.string().url('Debe ser una URL válida para la imagen.').or(z.literal('')),
});

type HomeBannerFormData = z.infer<typeof formSchema>;

export default function HomeBannerForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const router = useRouter();

  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'main');
  }, [firestore]);

  const { data: config, isLoading: isConfigLoading } = useDoc<Config>(configRef);

  const form = useForm<HomeBannerFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homeBannerUrl: '',
    },
  });
  
  useEffect(() => {
    if (config?.homeBannerUrl) {
      form.reset({ homeBannerUrl: config.homeBannerUrl });
    } else {
      form.reset({ homeBannerUrl: '' });
    }
  }, [config, form]);


  async function onSubmit(values: HomeBannerFormData) {
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
        homeBannerUrl: values.homeBannerUrl || null,
    };

    setDoc(configRef, dataToSave, { merge: true }).then(() => {
        toast({ title: 'Éxito', description: 'Banner de inicio actualizado.' });
        router.push('/admin/home-banner');
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
            name="homeBannerUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del Banner</FormLabel>
                <FormControl><Input placeholder="https://ik.imagekit.io/..." {...field} /></FormControl>
                <FormDescription>Pega la URL de la imagen aquí. Déjalo en blanco para no mostrar ningún banner.</FormDescription>
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
