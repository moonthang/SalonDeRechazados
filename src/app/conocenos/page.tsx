'use client';

import { Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/components/contact-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function ConocenosPage() {
  return (
    <main className="container mx-auto px-4 pt-12 pb-16 sm:pt-24 sm:pb-32 overflow-hidden">
      <section className="mb-24 text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
          Conócenos
        </h1>
        <p className="font-body text-xl md:text-2xl text-muted-foreground font-light tracking-wide max-w-3xl mx-auto">
          No es un lugar para los que saben de cine. Es un lugar para los que lo sienten.
        </p>
      </section>

      <section className="max-w-prose mx-auto space-y-16 mb-24">
        <div>
          <p className="text-xl md:text-2xl leading-relaxed text-foreground/90 mb-12">
            SDR nació de una incomodidad: la de querer hablar de películas de otra manera. Sin reseñas técnicas. Sin el tono de enciclopedia. Aquí el cine se convierte en conversación real, no importa cuántas películas hayas visto, sino qué te dejaron.
          </p>
          <div className="aspect-video relative rounded-2xl overflow-hidden shadow-lg border border-border">
            <Image 
              src="https://ik.imagekit.io/axct8mpp27/Screenshots/SRD_Banner_TV.jpg?updatedAt=1776110696892"
              alt="Banner de Salón de Rechazados"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <p className="text-xl md:text-2xl leading-relaxed text-foreground/90 mb-12">
            El mapache con la cámara no es casualidad. Es un bicho nocturno, curioso, un poco caótico, que encuentra valor en lo que otros descartan. Eso somos: un proyecto que mira el cine desde los márgenes. Lo que no se discute en los grandes medios. Lo que se siente pero cuesta explicar. Lo que sigue dando vueltas días después de que termina la película.
          </p>
          <div className="aspect-square relative max-w-md mx-auto">
             <Image 
              src="https://ik.imagekit.io/axct8mpp27/Screenshots/Recurso%2017.png"
              alt="Ilustración de mapache"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div>
          <p className="text-xl md:text-2xl leading-relaxed text-foreground/90">
            Hoy somos ideas, ensayos visuales y reflexiones sobre el color, la atmósfera y el tiempo. Pero esto es el primer acto. Lo que viene es salir a grabar, producir historias y construir algo propio.
          </p>
        </div>
      </section>

      <section className="w-full bg-white/5 backdrop-blur-lg saturate-150 border border-primary py-32 mb-32 -mx-4 sm:mx-0 sm:rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-primary leading-tight">
            De hablar de cine a hacerlo.
          </h2>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mb-32 px-6">
        <h2 className="font-headline text-4xl font-bold mb-8 tracking-tight">Próximamente</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="quiz-recommender" className="border-white/10">
            <AccordionTrigger className="text-xl md:text-2xl font-headline py-6 hover:text-primary transition-colors text-left">
              ¿No sabes qué ver? Nuestro recomendador inteligente
            </AccordionTrigger>
            <AccordionContent className="text-lg text-muted-foreground leading-relaxed pt-2 pb-6">
              Estamos desarrollando una experiencia interactiva única. Pronto podrás completar un breve quiz sobre tus gustos, el ambiente que buscas y lo que quieres sentir. Con tus respuestas, nuestro sistema te sugerirá la película perfecta de "El Salón" para tu momento actual, rescatando esas joyas que conectan con tu sensibilidad.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div>
          <h3 className="font-headline text-4xl font-bold mb-4 tracking-tight">¿Quieres escribirnos?</h3>
          <p className="text-lg text-muted-foreground">
            Una recomendación, una pregunta, una película que no te soltó. Lo que sea.
          </p>
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4 text-primary">
              <Mail className="w-5 h-5" />
              <span className="font-body">elsalonderechazados@gmail.com</span>
            </div>
             <Button variant="outline" asChild>
              <Link href="https://us-west-2.graphassets.com/cmnqecy34054e08lsedmvdfa0/cmoc5pcc9y04g07n3f5b9kicp" target="_blank" rel="noopener noreferrer">
                Elementos de marca
              </Link>
            </Button>
          </div>
        </div>
        
        <Card className="glass-card">
          <CardContent className="p-8 md:p-12">
            <ContactForm />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
