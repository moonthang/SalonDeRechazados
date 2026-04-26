'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import EpisodeList from '@/components/admin/archivoVisual/episode-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import FeaturedArchiveForm from '@/components/admin/archivoVisual/featured-archive-form';

export default function AdminSalonPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFeaturedArchiveOpen, setIsFeaturedArchiveOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar "Catálogo Archivo Visual"</h1>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div className='flex-grow'>
              <CardTitle>Catálogo de Video-Ensayos</CardTitle>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className='w-full sm:w-auto'>
                  <Link href="/admin/archivoVisual/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Video-Ensayo
                  </Link>
                </Button>
                 <Dialog open={isFeaturedArchiveOpen} onOpenChange={setIsFeaturedArchiveOpen}>
                    <DialogTrigger asChild>
                        <Button variant='outline' className='w-full sm:w-auto'>
                            <Star className="mr-2 h-4 w-4" />
                            Archivo Destacado
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                        <DialogTitle>Editar Video Destacado del Archivo</DialogTitle>
                        <DialogDescription>
                            Modifica la URL del video que aparece en la página de "Archivo Visual".
                        </DialogDescription>
                        </DialogHeader>
                        <FeaturedArchiveForm onSuccess={() => setIsFeaturedArchiveOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por título..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <EpisodeList searchQuery={searchQuery} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
