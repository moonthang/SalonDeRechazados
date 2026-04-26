import AdminLayout from '@/components/admin/admin-layout';
import FilmForm from '@/components/admin/salon/film-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewFilmPage() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Añadir Nueva Película</CardTitle>
          </CardHeader>
          <CardContent>
            <FilmForm />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
