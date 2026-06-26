'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ContactForm from '@/components/contact-form';

export default function ContactCTA() {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [shadowStyle, setShadowStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // posición x dentro del elemento
    const y = e.clientY - rect.top;  // posición y dentro del elemento

    // Calcular desplazamiento desde el centro (-1 a 1)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    // Invertimos la dirección de la sombra para que se aleje del cursor
    const shadowX = -deltaX * 25; 
    const shadowY = -deltaY * 25;

    setShadowStyle({
      boxShadow: `${shadowX}px ${shadowY}px 50px -10px hsl(var(--primary) / 0.4)`,
      transition: 'box-shadow 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setShadowStyle({
      boxShadow: '0 0 20px -5px hsl(var(--primary) / 0.1)',
      transition: 'box-shadow 0.5s ease-in-out'
    });
  };

  return (
    <section>
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="rounded-2xl transition-all duration-300"
        style={shadowStyle}
      >
        <Card className="glass-card overflow-hidden border-primary/20 shadow-none">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="flex-1">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4 leading-tight">
                  ¿Tienes algo que decir?
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Una recomendación, una pregunta o simplemente compartir lo que sentiste con una película. Nos encanta leerte y saber qué piensas del proyecto.
                </p>
              </div>
              
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="shrink-0 px-8 py-8 text-lg h-auto rounded-2xl group">
                    <Mail className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
                    Escríbenos ahora
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] glass-card border-primary/20 p-8">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-3xl font-bold tracking-tight">Escríbenos</DialogTitle>
                    <DialogDescription className="text-base">
                      Envíanos tus ideas, comentarios o saludos. Te responderemos pronto.
                    </DialogDescription>
                  </DialogHeader>
                  <ContactForm onSuccess={() => setOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
