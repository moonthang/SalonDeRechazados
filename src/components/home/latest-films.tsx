import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import FilmCard from "@/components/salon/film-card";
import type { Film } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type LatestFilmsProps = {
  films: Film[];
};

export default function LatestFilms({ films }: LatestFilmsProps) {
  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            Últimos Ingresos a El Salón
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Descubre joyas pocas conocidas en la historia del cine.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/salon">
            Ver catálogo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-6">
          {films.map((film) => (
            <CarouselItem key={film.id} className="pl-6 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <FilmCard film={film} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
}
