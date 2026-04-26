import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import type { FeaturedItem } from "@/lib/types";
import { Badge } from "../ui/badge";

type FeaturedItemProps = {
  item?: FeaturedItem;
};

export default function LatestAfterglow({ item }: FeaturedItemProps) {
  return (
    <section>
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
          Último Afterglow
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Nuestro más reciente video-ensayo.
        </p>
      </div>
      {item ? (
        <Card className="bg-card overflow-hidden border border-border">
          <div className="grid md:grid-cols-5 items-center gap-4">
            <div className="md:col-span-2 p-4 sm:p-8">
              <div className="bg-black/30 p-2 rounded-xl shadow-lg">
                <Image
                  src={item.coverUrl}
                  alt={`Portada de ${item.movieTitle}`}
                  width={500}
                  height={750}
                  className="w-full h-auto object-cover rounded-lg aspect-[2/3]"
                  data-ai-hint="video thumbnail movie poster"
                />
              </div>
            </div>
            <div className="md:col-span-3 px-4 pb-8 sm:p-8 flex flex-col justify-center">
              <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">
                Dirigida por {item.director}
              </p>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{item.movieTitle}</h3>
              
              {item.description && (
                  <p className="text-muted-foreground mb-8 text-base leading-relaxed">{item.description}</p>
              )}

              {item.watchOn && item.watchOn.length > 0 && (
                <div className="mb-10">
                    <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                        Disponible en
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {item.watchOn.map((platform) => (
                        <Link href={platform.link || '#'} key={platform.plataforma} target="_blank" rel="noopener noreferrer">
                          <Badge className="text-sm py-1 px-3 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors">
                              {platform.plataforma}
                          </Badge>
                        </Link>
                        ))}
                    </div>
                </div>
              )}
              
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href={item.videoUrl} target="_blank" rel="noopener noreferrer">
                  Ver Video
                  <Youtube className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="glass-card overflow-hidden text-center">
            <CardContent className="p-12">
                <p className="text-muted-foreground">No hay ningún video destacado en este momento.</p>
            </CardContent>
        </Card>
      )}
    </section>
  );
}
