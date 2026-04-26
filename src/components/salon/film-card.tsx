import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { Film } from "@/lib/types";
import { getCountryFlag } from "@/lib/country-flags";
import { Badge } from "../ui/badge";
import { Clock } from "lucide-react";

type FilmCardProps = {
  film: Film;
};

export default function FilmCard({ film }: FilmCardProps) {
  return (
    <Link href={`/salon/${film.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 aspect-[2/3] relative rounded-lg border-white/10 bg-transparent">
        <Image
          src={film.posterUrl}
          alt={`Póster de ${film.titulo}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint="movie poster"
        />
        
        <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-black/90 to-transparent" />
        
        <div className="relative flex h-full flex-col justify-end p-4 text-white">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold leading-tight flex-1 text-primary-foreground">{film.titulo}</h3>
              <p className="text-xs text-primary-foreground/80 font-semibold bg-black/50 px-1.5 py-0.5 rounded">{film.año}</p>
            </div>
            <p className="text-xs text-primary-foreground/80 mt-1 truncate">{film.direccion}</p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-primary-foreground/80 mt-2">
            <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>{film.duracion} min</span>
            </div>
            <span className="text-lg" title={film.pais}>{getCountryFlag(film.pais)}</span>
          </div>

          {film.disponibleEn && film.disponibleEn.length > 0 && (
            <div className="pt-3 mt-3 border-t border-white/20">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary-foreground/80 shrink-0">Ver en:</span>
                    <div className="flex flex-wrap gap-1">
                        {film.disponibleEn.slice(0, 1).map((platform) => (
                        <Badge key={platform.plataforma} className="bg-primary/20 text-primary border-primary/30 text-[10px] px-2 py-0.5 hover:bg-primary/30">
                            {platform.plataforma}
                        </Badge>
                        ))}
                    </div>
                </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
