'use client';

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import type { AfterglowEpisode } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
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
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type EpisodeWithId = AfterglowEpisode & { id: string };

export default function EpisodeList({ searchQuery }: { searchQuery: string }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const episodesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'afterglow');
  }, [firestore]);

  const { data: episodes, isLoading } = useCollection<EpisodeWithId>(episodesCollection);

  const filteredEpisodes = useMemo(() => {
    if (!episodes) return [];
    const lowercasedQuery = searchQuery.toLowerCase();
    return episodes.filter(episode => 
        episode.title.toLowerCase().includes(lowercasedQuery)
    );
  }, [episodes, searchQuery]);

  const sortedEpisodes = useMemo(() => {
    if (!filteredEpisodes) return [];
    return [...filteredEpisodes].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
            return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
    });
  }, [filteredEpisodes]);

  const totalPages = Math.ceil(sortedEpisodes.length / itemsPerPage);
  
  const paginatedEpisodes = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return sortedEpisodes.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedEpisodes, currentPage]);

  const handleDelete = async (episodeId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'afterglow', episodeId));
      toast({
        title: 'Episodio eliminado',
        description: 'El video-ensayo ha sido eliminado del catálogo.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el episodio.',
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  }

  if (isLoading) {
    return (
        <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    )
  }

  if (!episodes || episodes.length === 0) {
    return <p>No hay video-ensayos en el catálogo todavía.</p>;
  }

  if (paginatedEpisodes.length === 0 && searchQuery) {
    return <p>No se encontraron video-ensayos con el título "{searchQuery}".</p>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead className="hidden sm:table-cell">Fecha del Episodio</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedEpisodes.map((episode) => (
            <TableRow key={episode.id}>
              <TableCell className="font-medium">{episode.title}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {episode.episodeDate ? format(new Date(episode.episodeDate.replace(/-/g, '/')), "d 'de' MMMM, yyyy", { locale: es }) : null}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/archivoVisual/edit/${episode.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Eliminar</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente el
                                video-ensayo de tu catálogo.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(episode.id)} className="bg-destructive hover:bg-destructive/90">
                                Sí, eliminar
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
       {totalPages > 1 && (
        <div className="flex items-center justify-end gap-4 p-4 border-t">
          <span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</span>
          <div className='flex items-center gap-2'>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Página siguiente</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
