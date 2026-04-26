import AdminLayout from '@/components/admin/admin-layout';
import FeaturedItemForm from '@/components/admin/archivoVisual/featured-item-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditFeaturedPage() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Editar Video Destacado</CardTitle>
          </CardHeader>
          <CardContent>
            <FeaturedItemForm />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
