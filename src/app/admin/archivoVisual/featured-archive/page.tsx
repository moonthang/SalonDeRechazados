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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import type { Config } from '@/lib/types';
import { doc, updateDoc } from 'firebase/firestore';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/admin-layout';
import { useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const getYouTubeEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        let videoId = null;
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            videoId = urlObj.searchParams.get('v');
        } else if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        }
        
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    } catch (e) {
        // Invalid URL
    }
    return null;
};


export default function AdminFeaturedArchivePage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'main');
  }, [firestore]);

  const { data: config, isLoading: isConfigLoading } = useDoc<Config>(configRef);

  const featuredUrl = config?.featuredArchiveVideoUrl;
  const embedUrl = getYouTubeEmbedUrl(featuredUrl);

  const handleClearFeatured = async () => {
    if (!configRef) return;
    setIsDeleting(true);
    const dataToSave = { featuredArchiveVideoUrl: null };
    updateDoc(configRef, dataToSave)
    .then(() => {
        toast({
            title: 'Éxito',
            description: 'Se ha eliminado el video destacado del archivo.',
        });
    })
    .catch((err: any) => {
      if (err.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
            path: 'config/main',
            operation: 'update',
            requestResourceData: dataToSave,
        });
        errorEmitter.emit('permission-error', permissionError);
      } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudo eliminar el video destacado.',
        });
      }
    })
    .finally(() => {
        setIsDeleting(false);
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Archivo Destacado</h1>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle>Video Destacado del Archivo</CardTitle>
            </div>
            <Button asChild>
              <Link href="/admin/archivoVisual/featured-archive/edit">
                <Edit className="mr-2 h-4 w-4" />
                {featuredUrl ? 'Cambiar Video' : 'Añadir Video'}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isConfigLoading && (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full aspect-video" />
            </div>
          )}
          {!isConfigLoading && featuredUrl && (
            <div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-border mb-6">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        title="Featured YouTube Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                ) : (
                    <div className='w-full h-full flex items-center justify-center bg-muted'>
                        <p className='text-muted-foreground'>URL no es un video de YouTube: <Link href={featuredUrl} className='text-primary hover:underline' target='_blank'>{featuredUrl}</Link></p>
                    </div>
                )}
              </div>
                
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
                          Esta acción no se puede deshacer. El video destacado se eliminará de la página de Archivo Visual.
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
          )}
           {!isConfigLoading && !featuredUrl && (
             <div className="text-center py-12">
                <p className="text-muted-foreground">No hay ningún video destacado configurado para el archivo.</p>
                <p className='text-sm text-muted-foreground mt-2'>Se mostrará la imagen por defecto.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
