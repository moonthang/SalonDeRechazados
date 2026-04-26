'use client';

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import type { Film } from '@/lib/types';
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

type FilmWithId = Film & { id: string };

export default function FilmList({ searchQuery }: { searchQuery: string }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const filmsPerPage = 10;

  const filmsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'salon');
  }, [firestore]);

  const { data: films, isLoading } = useCollection<FilmWithId>(filmsCollection);

  const filteredFilms = useMemo(() => {
    if (!films) return [];
    const lowercasedQuery = searchQuery.toLowerCase();
    return films.filter(film => 
        film.titulo.toLowerCase().includes(lowercasedQuery)
    );
  }, [films, searchQuery]);

  const sortedFilms = useMemo(() => {
    if (!filteredFilms) return [];
    return [...filteredFilms].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
            return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
    });
  }, [filteredFilms]);

  const totalPages = Math.ceil(sortedFilms.length / filmsPerPage);
  
  const paginatedFilms = useMemo(() => {
      const startIndex = (currentPage - 1) * filmsPerPage;
      return sortedFilms.slice(startIndex, startIndex + filmsPerPage);
  }, [sortedFilms, currentPage]);

  const handleDelete = async (filmId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'salon', filmId));
      toast({
        title: 'Película eliminada',
        description: 'La película ha sido eliminada del catálogo.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar la película.',
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

  if (!films || films.length === 0) {
    return <p>No hay películas en el catálogo todavía.</p>;
  }

  if (paginatedFilms.length === 0 && searchQuery) {
    return <p>No se encontraron películas con el título "{searchQuery}".</p>;
  }


  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead className="hidden sm:table-cell">Director</TableHead>
            <TableHead className="hidden md:table-cell">Año</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedFilms.map((film) => (
            <TableRow key={film.id}>
              <TableCell className="font-medium">{film.titulo}</TableCell>
              <TableCell className="hidden sm:table-cell">{film.direccion}</TableCell>
              <TableCell className="hidden md:table-cell">{film.año}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/salon/edit/${film.id}`}>
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
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la
                                película de tu catálogo.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(film.id)} className="bg-destructive hover:bg-destructive/90">
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
