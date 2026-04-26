'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import type { Config } from '@/lib/types';
import { doc, updateDoc } from 'firebase/firestore';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AdminLayout from '@/components/admin/admin-layout';
import { useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminFeaturedPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'main');
  }, [firestore]);

  const { data: config, isLoading: isConfigLoading } = useDoc<Config>(configRef);

  const featuredItem = config?.featuredItem;

  const handleClearFeatured = async () => {
    if (!configRef) return;
    setIsDeleting(true);
    try {
      await updateDoc(configRef, {
        featuredItem: null,
      });
      toast({
        title: 'Éxito',
        description: 'Se ha eliminado el video destacado.',
      });
    } catch (err: any) {
      if (err.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
            path: 'config/main',
            operation: 'update',
            requestResourceData: { 'featuredItem': null },
        });
        errorEmitter.emit('permission-error', permissionError);
      } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudo eliminar el video destacado.',
        });
      }
    } finally {
        setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Video Destacado</h1>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle>Video Destacado Actual</CardTitle>
            </div>
            <Button asChild>
              <Link href="/admin/archivoVisual/featured/edit">
                <Edit className="mr-2 h-4 w-4" />
                {featuredItem ? 'Editar Video' : 'Añadir Video'}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isConfigLoading && (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}
          {!isConfigLoading && featuredItem && (
            <div>
              <div className="grid md:grid-cols-5 items-start gap-8">
                <div className="md:col-span-2">
                    <Image
                      src={featuredItem.coverUrl}
                      alt={`Portada de ${featuredItem.movieTitle}`}
                      width={500}
                      height={750}
                      className="w-full h-auto object-cover rounded-lg aspect-[2/3]"
                    />
                </div>
                <div className="md:col-span-3">
                  <p className="text-sm font-semibold uppercase text-primary mb-1">
                    Dirigida por {featuredItem.director}
                  </p>
                  <h3 className="text-3xl font-bold tracking-tight mb-4">{featuredItem.movieTitle}</h3>
                  
                  {featuredItem.description && (
                    <div className="mb-6">
                        <h4 className="font-semibold mb-2">Descripción</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{featuredItem.description}</p>
                    </div>
                  )}

                  {featuredItem.watchOn && featuredItem.watchOn.length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-semibold mb-2">Disponible en</h4>
                        <div className="flex flex-wrap gap-2">
                            {featuredItem.watchOn.map((platform) => (
                            <Badge key={platform.plataforma} variant="outline">
                                {platform.plataforma}
                            </Badge>
                            ))}
                        </div>
                    </div>
                  )}
                    <h4 className="font-semibold mb-2">Enlace al video</h4>
                    <Link href={featuredItem.videoUrl} target='_blank' rel='noopener noreferrer' className='text-sm text-primary hover:underline break-all'>
                        {featuredItem.videoUrl}
                    </Link>
                </div>
              </div>
                <div className="mt-6 border-t border-border pt-6">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {isDeleting ? 'Eliminando...' : 'Eliminar Video Destacado'}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. El video destacado se eliminará de la página de inicio.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleClearFeatured} className="bg-destructive hover:bg-destructive/90">
                                Sí, eliminar
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
          )}
           {!isConfigLoading && !featuredItem && (
             <div className="text-center py-12">
                <p className="text-muted-foreground">No hay ningún video destacado configurado.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
