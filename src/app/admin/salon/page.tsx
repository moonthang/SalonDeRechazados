'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import FilmList from '@/components/admin/salon/film-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminSalonPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar "El Salón"</h1>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div className='flex-grow'>
              <CardTitle>Catálogo de Películas</CardTitle>
            </div>
            <Button asChild className='w-full sm:w-auto'>
              <Link href="/admin/salon/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Película
              </Link>
            </Button>
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
          <FilmList searchQuery={searchQuery} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
