'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { Config } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/admin-layout';
import Image from 'next/image';

export default function AdminHomeBannerPage() {
  const firestore = useFirestore();

  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'main');
  }, [firestore]);

  const { data: config, isLoading: isConfigLoading } = useDoc<Config>(configRef);

  const bannerUrl = config?.homeBannerUrl;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Banner de Inicio</h1>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle>Banner de la Página de Inicio</CardTitle>
            </div>
            <Button asChild>
              <Link href="/admin/home-banner/edit">
                <Edit className="mr-2 h-4 w-4" />
                {bannerUrl ? 'Cambiar Banner' : 'Añadir Banner'}
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
          {!isConfigLoading && bannerUrl && (
            <div>
              <div className="relative aspect-[16/7] rounded-lg overflow-hidden bg-black border border-border">
                <Image
                    src={bannerUrl}
                    alt="Banner de Inicio"
                    fill
                    className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
           {!isConfigLoading && !bannerUrl && (
             <div className="text-center py-12">
                <p className="text-muted-foreground">No hay ningún banner configurado.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
