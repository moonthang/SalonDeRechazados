'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { AfterglowEpisode } from '@/lib/types';
import AdminLayout from '@/components/admin/admin-layout';
import EpisodeForm from '@/components/admin/archivoVisual/episode-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type EpisodeWithId = AfterglowEpisode & { id: string };

export default function EditEpisodePage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();

  const episodeRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'afterglow', id);
  }, [firestore, id]);

  const { data: episode, isLoading } = useDoc<EpisodeWithId>(episodeRef);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Editar Video-Ensayo</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            )}
            {episode && <EpisodeForm episodeToEdit={episode} />}
            {!isLoading && !episode && (
              <p className="text-destructive">No se pudo encontrar el episodio para editar.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
