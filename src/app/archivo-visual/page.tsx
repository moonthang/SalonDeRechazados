import { getAfterglowEpisodes, getConfig } from '@/lib/firestore';
import ArchivoVisualContent from './content';

export const revalidate = 60;

export default async function ArchivoVisualPage() {
  const allEpisodesForTags = await getAfterglowEpisodes();
  const config = await getConfig();
  const tags = [...new Set(allEpisodesForTags.map((episode) => episode.tags || []).flat())].sort();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                    Archivo <span className="text-primary">Visual</span>
                </h1>
            </div>
            <p className="text-lg text-muted-foreground md:text-right">
                Publicaciones, video-ensayos y exploraciones del cine que nos apasiona.
            </p>
        </div>
        
        <ArchivoVisualContent 
          tags={tags}
          featuredArchiveVideoUrl={config?.featuredArchiveVideoUrl}
        />
    </div>
  );
}
