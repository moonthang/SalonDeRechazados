'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(1, 'Tu nombre es requerido.'),
  email: z.string().email('Por favor, introduce un email válido.'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres.'),
});

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
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
      if (onSuccess) onSuccess();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">¿Cómo te llamás?</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Tu nombre" 
                  {...field} 
                  className="bg-transparent border-0 border-b rounded-none border-border focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary px-0" 
                />
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
                <Input 
                  placeholder="hola@ejemplo.com" 
                  {...field} 
                  className="bg-transparent border-0 border-b rounded-none border-border focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary px-0" 
                />
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
                <Textarea 
                  placeholder="Envianos un mensaje..." 
                  rows={4} 
                  {...field} 
                  className="bg-transparent border-0 border-b rounded-none border-border focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary px-0 resize-none" 
                />
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
  );
}
