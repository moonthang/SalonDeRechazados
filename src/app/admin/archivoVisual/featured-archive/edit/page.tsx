import AdminLayout from '@/components/admin/admin-layout';
import FeaturedArchiveForm from '@/components/admin/archivoVisual/featured-archive-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditFeaturedArchivePage() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Editar Video Destacado del Archivo</CardTitle>
          </CardHeader>
          <CardContent>
            <FeaturedArchiveForm />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
