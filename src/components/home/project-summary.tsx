import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type ProjectSummaryProps = {
  about?: string;
};

export default function ProjectSummary({ about }: ProjectSummaryProps) {
  const summary = about 
    ? about.split('\n')[0] 
    : "Salón de Rechazados Films es un espacio dedicado a la apreciación y difusión del cine que a menudo se queda en los márgenes. Celebramos las obras que desafían, que experimentan y que merecen ser vistas.";

  return (
    <section className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
                ¿Qué es <span>Salón de Rechazados</span>?
            </h2>
        </div>
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="flex justify-center">
            <Image
                src="https://ik.imagekit.io/axct8mpp27/Screenshots/PostSDR1.png?updatedAt=1776110696337"
                alt="Ejemplo de publicación de Salón de Rechazados"
                width={400}
                height={400}
                className="rounded-lg shadow-2xl object-contain"
                data-ai-hint="social media post"
            />
        </div>
        <div className="text-center md:text-left">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {summary}
            </p>
            <Button asChild size="lg" className="mt-8">
                <Link href="/conocenos">
                Conócenos
                <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
