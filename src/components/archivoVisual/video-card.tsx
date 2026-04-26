import { Card } from "@/components/ui/card";
import type { AfterglowEpisode } from "@/lib/types";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface PostCardProps {
    episode: AfterglowEpisode;
}

const getInstagramEmbedUrl = (url: string): string | null => {
  try {
    const urlObject = new URL(url);
    if (urlObject.hostname.includes('instagram.com')) {
      const path = urlObject.pathname.endsWith('/') ? urlObject.pathname.slice(0, -1) : urlObject.pathname;
      if (path.includes('/embed')) return url;
      return `${urlObject.origin}${path}/embed`;
    }
    return null;
  } catch (e) {
    return null;
  }
};


export default function PostCard({ episode }: PostCardProps) {
  const embedUrl = getInstagramEmbedUrl(episode.postUrl);

  return (
    <Card className="glass-card overflow-hidden">
      {embedUrl ? (
        <div className="aspect-[4/5] relative w-full">
          <iframe
            src={embedUrl}
            allowFullScreen
            className="w-full h-full border-0"
            scrolling="no"
          ></iframe>
        </div>
      ) : (
        <div className="aspect-[4/5] relative w-full bg-muted flex items-center justify-center p-8">
            <div className="text-center">
                <p className="text-muted-foreground mb-4">No se puede previsualizar esta publicación.</p>
                <Button asChild>
                    <Link href={episode.postUrl} target="_blank" rel="noopener noreferrer">
                        Ver Publicación
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
      )}
    </Card>
  );
}
