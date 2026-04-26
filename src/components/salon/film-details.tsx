'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock } from "lucide-react";
import type { Film } from "@/lib/types";
import { getCountryFlag } from "@/lib/country-flags";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type FilmDetailsProps = {
  film: Film;
};

function BackButton() {
  const router = useRouter();
  return (
    <Button variant="outline" size="icon" onClick={() => router.back()} className="mb-8 rounded-full">
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Volver al catálogo</span>
    </Button>
  );
}


export default function FilmDetails({ film }: FilmDetailsProps) {
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  
  return (
    <div className="container mx-auto px-4">
       <BackButton />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">
        <div className="md:col-span-1 lg:col-span-1">
          <Card className="glass-card overflow-hidden sticky top-24">
            <div className="aspect-[2/3] relative">
              <Image
                src={film.posterUrl}
                alt={`Póster de ${film.titulo}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
                data-ai-hint="movie poster"
              />
            </div>
            {film.letterboxdUrl && (
              <CardContent className="p-4">
                <Button asChild className="w-full bg-[#00E054] hover:bg-[#00C84A] text-black font-bold">
                  <Link href={film.letterboxdUrl} target="_blank" rel="noopener noreferrer">
                    <Image src="https://ik.imagekit.io/axct8mpp27/Screenshots/letterboxd-mac-icon.png" alt="Letterboxd Icon" width={20} height={20} className="w-5 h-5 mr-2" />
                    Letterboxd
                  </Link>
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <Card className="glass-card">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="text-3xl lg:text-5xl">{film.titulo}</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">{film.direccion}</CardDescription>
              </div>
              <div className="text-left sm:text-right flex-shrink-0 pt-2">
                <p className="text-2xl font-bold">{film.año}</p>
                <div className="mt-2 flex items-center justify-start sm:justify-end gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{film.duracion} min.</span>
                </div>
                <div className="mt-1 flex items-center justify-start sm:justify-end gap-2 text-muted-foreground">
                  <span className="text-lg">{getCountryFlag(film.pais)}</span>
                  <span className="hidden sm:inline">{film.pais}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="flex flex-wrap gap-2 mb-8">
                {film.genero.map((genre) => (
                  <Badge key={genre} className="text-sm py-2 px-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors cursor-default">
                    {genre}
                  </Badge>
                ))}
              </div>

              <h3 className="font-headline text-2xl mb-4">Sinopsis</h3>
              <p className="text-base lg:text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {film.sinopsis}
              </p>

              <h3 className="font-headline text-2xl mt-8 mb-4">Disponible en</h3>
              <div className="flex flex-wrap gap-3">
                {film.disponibleEn.map((platform) => (
                  <Link href={platform.link || '#'} key={platform.plataforma} target="_blank" rel="noopener noreferrer">
                    <Badge className="text-sm py-2 px-4 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors">
                      {platform.plataforma}
                    </Badge>
                  </Link>
                ))}
              </div>

              {film.screenshots && film.screenshots.length > 0 && (
                <>
                  <h3 className="font-headline text-2xl mt-8 mb-4">Capturas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {film.screenshots.map((url, index) => (
                      url && (
                        <div 
                          key={index} 
                          className="aspect-video relative rounded-lg overflow-hidden border border-white/10 group cursor-pointer"
                          onClick={() => setSelectedScreenshot(url)}
                        >
                          <Image
                            src={url}
                            alt={`Captura de ${film.titulo} ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            data-ai-hint="movie screenshot"
                          />
                        </div>
                      )
                    ))}
                  </div>
                </>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={!!selectedScreenshot} onOpenChange={(isOpen) => !isOpen && setSelectedScreenshot(null)}>
        <DialogContent className="max-w-5xl w-full p-1 bg-black/80 backdrop-blur-md border-primary/30">
          {selectedScreenshot && (
            <Image
              src={selectedScreenshot}
              alt="Captura de película ampliada"
              width={1920}
              height={1080}
              className="w-full h-auto object-contain rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}