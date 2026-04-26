'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Film } from '@/lib/types';
import AdminLayout from '@/components/admin/admin-layout';
import FilmForm from '@/components/admin/salon/film-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type FilmWithId = Film & { id: string };

export default function EditFilmPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();

  const filmRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'salon', id);
  }, [firestore, id]);

  const { data: film, isLoading } = useDoc<FilmWithId>(filmRef);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Editar Película</CardTitle>
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
            {film && <FilmForm filmToEdit={film} />}
            {!isLoading && !film && (
              <p className="text-destructive">No se pudo encontrar la película para editar.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
