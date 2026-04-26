import FilmDetails from '@/components/salon/film-details';
import { getFilmBySlug, getFilms } from '@/lib/firestore';
import type { Film } from '@/lib/types';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export const revalidate = 60;

export async function generateStaticParams() {
  const films = await getFilms();
  return films
    .filter((film) => !!film.slug)
    .map((film) => ({
      id: film.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const film = await getFilmBySlug(params.id);
  if (!film) {
    return {
      title: 'Película no encontrada',
    };
  }
  return {
    title: `${film.titulo} (${film.año})`,
    description: film.sinopsis.substring(0, 160),
    openGraph: {
        title: `${film.titulo} | Salón de Rechazados`,
        description: film.sinopsis.substring(0, 160),
        images: [
            {
                url: film.posterUrl,
                width: 500,
                height: 750,
                alt: `Póster de ${film.titulo}`,
            },
        ],
        type: 'article',
    },
  };
}

export default async function FilmDetailPage({ params }: Props) {
  const film = (await getFilmBySlug(params.id)) as Film | null;

  if (!film) {
    notFound();
  }

  return (
    <div className="py-8 sm:py-16">
      <FilmDetails film={film} />
    </div>
  );
}