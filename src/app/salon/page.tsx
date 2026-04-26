import FilmGrid from '@/components/salon/film-grid';
import { getFilms } from '@/lib/firestore';
import Image from 'next/image';

export const revalidate = 60;

export default async function SalonPage() {
  const films = await getFilms();

  const genres = [...new Set(films.map((film) => film.genero).flat())].sort();
  const countries = [...new Set(films.map((film) => film.pais))].sort();

  return (
    <div className="container mx-auto px-4 pt-12 pb-8 sm:pt-24 sm:pb-16">
        <div className="grid md:grid-cols-3 gap-8 items-center mb-12">
             <div>
                <Image
                    src="https://ik.imagekit.io/axct8mpp27/Screenshots/SDR_Logo1(V2)-sticker.png"
                    alt="Salón de Rechazados Logo"
                    width={200}
                    height={200}
                    className="mx-auto md:mx-0"
                />
            </div>
            <div className="md:col-span-2 md:text-right">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">El Salón</h1>
                <p className="text-lg text-muted-foreground mt-4">
                    No son las más vistas. Tampoco las más premiadas. Son las que, si las encuentras, no las olvidás.
                </p>
            </div>
        </div>
      <FilmGrid films={films} genres={genres} countries={countries} />
    </div>
  );
}
