'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Image from 'next/image';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(1, 'Tu nombre es requerido.'),
  email: z.string().email('Por favor, introduce un email válido.'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres.'),
});

export default function ConocenosPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Algo salió mal.');
      }

      toast({
        title: '¡Mensaje enviado!',
        description: 'Gracias por escribirnos. Te responderemos pronto.',
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al enviar',
        description: error.message || 'No se pudo enviar tu mensaje. Inténtalo de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  }

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">¿Cómo te llamás?</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} className="bg-transparent border-0 border-b rounded-none border-border focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary px-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Tu correo</FormLabel>
                      <FormControl>
                        <Input placeholder="hola@ejemplo.com" {...field} className="bg-transparent border-0 border-b rounded-none border-border focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary px-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Escribe lo que quieras...</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Envianos un mensaje..." rows={4} {...field} className="bg-transparent border-0 border-b rounded-none border-border focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary px-0 resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-4">
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar mensaje'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
