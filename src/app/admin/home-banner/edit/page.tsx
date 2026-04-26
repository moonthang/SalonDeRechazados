import AdminLayout from '@/components/admin/admin-layout';
import HomeBannerForm from '@/components/admin/home-banner-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditHomeBannerPage() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Editar Banner de Inicio</CardTitle>
          </CardHeader>
          <CardContent>
            <HomeBannerForm />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
