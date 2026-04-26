import AdminLayout from '@/components/admin/admin-layout';
import EpisodeForm from '@/components/admin/archivoVisual/episode-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewEpisodePage() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Añadir Nuevo Video-Ensayo</CardTitle>
          </CardHeader>
          <CardContent>
            <EpisodeForm />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
