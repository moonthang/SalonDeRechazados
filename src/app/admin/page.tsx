import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clapperboard, Film, Video, GalleryHorizontal } from 'lucide-react';
import AdminLayout from '@/components/admin/admin-layout';
import DatabaseExporter from '@/components/admin/database-exporter';

const managementSections = [
    {
        title: 'El Salón',
        description: 'Gestionar el catálogo de películas.',
        href: '/admin/salon',
        icon: Film
    },
    {
        title: 'Video Destacado',
        description: 'Editar el video destacado de la página de inicio.',
        href: '/admin/archivoVisual/featured',
        icon: Clapperboard
    },
    {
        title: 'Catálogo Archivo Visual',
        description: 'Gestionar la colección de video-ensayos.',
        href: '/admin/archivoVisual',
        icon: Video,
    },
    {
        title: 'Banner de Inicio',
        description: 'Gestionar la imagen de banner en la página de inicio.',
        href: '/admin/home-banner',
        icon: GalleryHorizontal,
    }
]

export default function AdminDashboard() {
  return (
    <AdminLayout>
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managementSections.map(section => {
                const Icon = section.icon;
                return (
                    <Card key={section.title} className="bg-background/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon className="w-6 h-6 text-primary" />
                                {section.title}
                            </CardTitle>
                            <CardDescription>{section.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href={section.href}>
                                    Gestionar
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
        <DatabaseExporter />
    </AdminLayout>
  );
}
