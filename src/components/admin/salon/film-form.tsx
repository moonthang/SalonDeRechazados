'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query as firestoreQuery, doc, updateDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { getCountryFlag } from '@/lib/country-flags';
import type { Film } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { slugify } from '@/lib/utils';

const platformSchema = z.object({
  plataforma: z.string().min(1, 'El nombre de la plataforma es requerido.'),
  link: z.string().url('La URL no es válida').optional().or(z.literal('')),
});

const screenshotSchema = z.object({
  value: z.string().min(1, 'La URL no puede estar vacía.').url('Debe ser una URL válida.'),
});

const formSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido.'),
  año: z.coerce.number().min(1800, 'El año debe ser válido.').max(new Date().getFullYear() + 5),
  direccion: z.string().min(1, 'La dirección es requerida.'),
  genero: z.array(z.string()).nonempty({ message: 'Se requiere al menos un género.' }),
  pais: z.string().min(1, 'El país es requerido.'),
  duracion: z.coerce.number().min(1, 'La duración debe ser mayor a 0.'),
  posterUrl: z.string().url('Debe ser una URL válida para el póster.'),
  letterboxdUrl: z.string().url('La URL no es válida').optional().or(z.literal('')),
  sinopsis: z.string().min(10, 'La sinopsis es muy corta.'),
  disponibleEn: z.array(platformSchema).min(1, 'Añade al menos una plataforma.'),
  screenshots: z.array(screenshotSchema).max(4, 'Puedes añadir un máximo de 4 capturas.').optional(),
});

type FilmFormData = z.infer<typeof formSchema>;
type FilmWithId = Film & { id: string };

interface FilmFormProps {
  filmToEdit?: FilmWithId;
}

export default function FilmForm({ filmToEdit }: FilmFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const router = useRouter();

  const [genreInput, setGenreInput] = useState('');
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const form = useForm<FilmFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: filmToEdit ? {
        ...filmToEdit,
        genero: filmToEdit.genero || [],
        disponibleEn: filmToEdit.disponibleEn || [{ plataforma: '', link: '' }],
        screenshots: filmToEdit.screenshots ? filmToEdit.screenshots.map(url => ({ value: url })) : [],
        letterboxdUrl: filmToEdit.letterboxdUrl || '',
    } : {
      titulo: '',
      año: new Date().getFullYear(),
      direccion: '',
      genero: [],
      pais: '',
      duracion: 90,
      posterUrl: '',
      letterboxdUrl: '',
      sinopsis: '',
      disponibleEn: [{ plataforma: '', link: '' }],
      screenshots: [],
    },
  });

  useEffect(() => {
    if (filmToEdit) {
      form.reset({
        ...filmToEdit,
        screenshots: filmToEdit.screenshots ? filmToEdit.screenshots.map(url => ({ value: url })) : [],
        letterboxdUrl: filmToEdit.letterboxdUrl || '',
      });
    }
  }, [filmToEdit, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'disponibleEn',
  });
  
  const { fields: screenshotFields, append: appendScreenshot, remove: removeScreenshot } = useFieldArray({
    control: form.control,
    name: 'screenshots',
  });

  const selectedGenres = form.watch('genero');

  useEffect(() => {
    if (!firestore) return;
    const fetchGenres = async () => {
      try {
        const filmsRef = collection(firestore, 'salon');
        const q = firestoreQuery(filmsRef);
        const querySnapshot = await getDocs(q);
        const allFilms = querySnapshot.docs.map(doc => doc.data() as Film);
        const uniqueGenres = [...new Set(allFilms.flatMap(film => film.genero || []))];
        setAllGenres(uniqueGenres.sort());
      } catch (error) {
      }
    };
    fetchGenres();
  }, [firestore]);


  const handleGenreInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGenreInput(value);
    if (value) {
      const currentSelected = form.getValues('genero');
      const filtered = allGenres.filter(
        g => g.toLowerCase().includes(value.toLowerCase()) && !currentSelected.includes(g)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleAddGenre = (genreToAdd: string) => {
    const trimmedGenre = genreToAdd.trim();
    if (trimmedGenre && !form.getValues('genero').includes(trimmedGenre)) {
      const currentGenres = form.getValues('genero');
      form.setValue('genero', [...currentGenres, trimmedGenre], { shouldValidate: true });
    }
    setGenreInput('');
    setSuggestions([]);
  };

  const handleGenreKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddGenre(genreInput);
    }
  };
  
  const handleRemoveGenre = (genreToRemove: string) => {
    const currentGenres = form.getValues('genero');
    form.setValue('genero', currentGenres.filter(g => g !== genreToRemove), { shouldValidate: true });
  };


  async function onSubmit(values: FilmFormData) {
    setLoading(true);
    
    if(!firestore) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Servicio de base de datos no disponible.',
        });
        setLoading(false);
        return;
    }

    const slug = slugify(`${values.titulo}-${values.año}`);
    
    const dataToSave = {
        ...values,
        slug,
        screenshots: values.screenshots?.map(s => s.value) || [],
    };

    const operation = filmToEdit ? 
        updateDoc(doc(firestore, 'salon', filmToEdit.id), dataToSave) : 
        addDoc(collection(firestore, 'salon'), { ...dataToSave, createdAt: serverTimestamp() });

    operation.then(() => {
        toast({ title: 'Éxito', description: `Película ${filmToEdit ? 'actualizada' : 'añadida'}.` });
        router.push('/admin/salon');
        if (!filmToEdit) form.reset();
    }).catch((err: any) => {
        if (err.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: filmToEdit ? `salon/${filmToEdit.id}` : 'salon',
                operation: filmToEdit ? 'update' : 'create',
                requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
        } else {
             toast({ variant: 'destructive', title: 'Error', description: `No se pudo guardar la película: ${err.message}` });
        }
    }).finally(() => {
        setLoading(false);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl><Input placeholder="Título de la película" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl><Input placeholder="Nombre del Director/a" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="año"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Año</FormLabel>
                <FormControl><Input type="number" placeholder="2023" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duracion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración (minutos)</FormLabel>
                <FormControl><Input type="number" placeholder="120" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
            control={form.control}
            name="genero"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Género(s)</FormLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedGenres.map((genre: string) => (
                    <Badge key={genre} className="text-sm py-1 px-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                        {genre}
                        <button type="button" onClick={() => handleRemoveGenre(genre)} className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        <X className="h-3 w-3" />
                        <span className="sr-only">Eliminar {genre}</span>
                        </button>
                    </Badge>
                    ))}
                </div>
                <FormControl>
                    <div className="relative">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Añadir género..."
                                value={genreInput}
                                onChange={handleGenreInputChange}
                                onKeyDown={handleGenreKeyDown}
                            />
                            <Button type="button" onClick={() => handleAddGenre(genreInput)}>Añadir</Button>
                        </div>
                        {suggestions.length > 0 && (
                            <Card className="absolute z-10 w-full mt-2 p-2 bg-background border border-border">
                                <p className="text-xs text-muted-foreground px-2 pb-1">Sugerencias</p>
                                <div className="flex flex-wrap gap-1">
                                {suggestions.map(suggestion => (
                                    <Button key={suggestion} type="button" variant="ghost" size="sm" className="w-full justify-start h-auto py-1.5 px-2" onClick={() => handleAddGenre(suggestion)}>
                                    {suggestion}
                                    </Button>
                                ))}
                                </div>
                            </Card>
                        )}
                    </div>
                </FormControl>
                <FormDescription>
                    Escribe un género y presiona Enter o "Añadir".
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />
           <FormField
            control={form.control}
            name="pais"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                 <FormControl>
                    <div className="relative">
                        <Input placeholder="Francia" {...field} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl">{form.watch('pais') && getCountryFlag(form.watch('pais'))}</span>
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
        <FormField
            control={form.control}
            name="posterUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de la Carátula</FormLabel>
                <FormControl><Input placeholder="https://image.tmdb.org/..." {...field} /></FormControl>
                 <FormDescription>Copia y pega la URL de la imagen del póster desde themoviedb.org</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        
        <FormField
            control={form.control}
            name="letterboxdUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enlace a Letterboxd (Opcional)</FormLabel>
                <FormControl><Input placeholder="https://letterboxd.com/film/..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="sinopsis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sinopsis</FormLabel>
              <FormControl><Textarea placeholder="Escribe una sinopsis editorial..." {...field} rows={6} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
            <FormLabel>Disponible en</FormLabel>
            <FormDescription className="mb-4">Añade las plataformas de streaming y sus enlaces.</FormDescription>
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-background/50">
                        <FormField
                            control={form.control}
                            name={`disponibleEn.${index}.plataforma`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Plataforma</FormLabel>
                                    <FormControl><Input placeholder="MUBI" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`disponibleEn.${index}.link`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Enlace (Opcional)</FormLabel>
                                    <FormControl><Input placeholder="https://mubi.com/..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                            <Trash2 className="h-5 w-5 text-destructive"/>
                            <span className="sr-only">Eliminar plataforma</span>
                        </Button>
                    </div>
                ))}
            </div>
             <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ plataforma: '', link: '' })}
                >
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Plataforma
            </Button>
             <FormMessage>{form.formState.errors.disponibleEn?.message}</FormMessage>
        </div>

        <div>
          <FormLabel>Capturas de la Película (hasta 4)</FormLabel>
          <FormDescription className="mb-4">Añade hasta 4 URLs de imágenes de la película.</FormDescription>
          <div className="space-y-4">
            {screenshotFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name={`screenshots.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl><Input placeholder="https://image.tmdb.org/..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeScreenshot(index)}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                  <span className="sr-only">Eliminar captura</span>
                </Button>
              </div>
            ))}
          </div>
          {screenshotFields.length < 4 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => appendScreenshot({ value: '' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Captura
            </Button>
          )}
          <FormMessage>{form.formState.errors.screenshots?.message}</FormMessage>
        </div>

        <Button type="submit" disabled={loading} size="lg">
          {loading ? 'Guardando...' : filmToEdit ? 'Guardar Cambios' : 'Añadir Película'}
        </Button>
      </form>
    </Form>
  );
}
