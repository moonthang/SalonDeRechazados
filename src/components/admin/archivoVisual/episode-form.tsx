'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDocs, query as firestoreQuery, orderBy } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarIcon, PlusCircle, Trash2, X, Film as FilmIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { AfterglowEpisode, Film } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';

const platformSchema = z.object({
  plataforma: z.string().min(1, 'El nombre de la plataforma es requerido.'),
  link: z.string().url('La URL no es válida').optional().or(z.literal('')),
});

const formSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  postUrl: z.string().url('Por favor, introduce una URL válida.'),
  episodeDate: z.date({
    required_error: 'La fecha de publicación es requerida.',
  }),
  tags: z.array(z.string()).optional(),
  linkedFilmId: z.string().optional(),
  disponibleEn: z.array(platformSchema).optional(),
});

type EpisodeFormData = z.infer<typeof formSchema>;
type EpisodeWithId = AfterglowEpisode & { id: string };

interface EpisodeFormProps {
  episodeToEdit?: EpisodeWithId;
}

export default function EpisodeForm({ episodeToEdit }: EpisodeFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const router = useRouter();

  const [tagInput, setTagInput] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allFilms, setAllFilms] = useState<Film[]>([]);

  const form = useForm<EpisodeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: episodeToEdit ? {
        ...episodeToEdit,
        episodeDate: episodeToEdit.episodeDate ? new Date(episodeToEdit.episodeDate.replace(/-/g, '/')) : new Date(),
        tags: episodeToEdit.tags || [],
        linkedFilmId: episodeToEdit.linkedFilmId || 'none',
        disponibleEn: episodeToEdit.disponibleEn || [],
    } : {
      title: '',
      postUrl: '',
      episodeDate: new Date(),
      tags: [],
      linkedFilmId: 'none',
      disponibleEn: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'disponibleEn',
  });

  const selectedTags = form.watch('tags') || [];
  const linkedFilmId = form.watch('linkedFilmId');

  useEffect(() => {
    if (!firestore) return;
    const fetchData = async () => {
      const episodesRef = collection(firestore, 'afterglow');
      const qE = firestoreQuery(episodesRef);
      const epSnap = await getDocs(qE);
      const uniqueTags = [...new Set(epSnap.docs.flatMap(doc => (doc.data() as AfterglowEpisode).tags || []))];
      setAllTags(uniqueTags.sort());

      const filmsRef = collection(firestore, 'salon');
      const qF = firestoreQuery(filmsRef, orderBy('titulo', 'asc'));
      const filmSnap = await getDocs(qF);
      setAllFilms(filmSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Film)));
    };
    fetchData();
  }, [firestore]);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    if (value) {
        const currentSelected = form.getValues('tags') || [];
        const filtered = allTags.filter(
        g => g.toLowerCase().includes(value.toLowerCase()) && !currentSelected.includes(g)
        );
        setSuggestions(filtered.slice(0, 5));
    } else {
        setSuggestions([]);
    }
  };

  const handleAddTag = (tagToAdd: string) => {
    const trimmedTag = tagToAdd.trim();
    const currentTags = form.getValues('tags') || [];
    if (trimmedTag && !currentTags.includes(trimmedTag)) {
        form.setValue('tags', [...currentTags, trimmedTag], { shouldValidate: true });
    }
    setTagInput('');
    setSuggestions([]);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTag(tagInput);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(g => g !== tagToRemove), { shouldValidate: true });
  };

  async function onSubmit(values: EpisodeFormData) {
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

    const linkedFilm = allFilms.find(f => f.id === values.linkedFilmId);
    
    const dataToSave = {
        ...values,
        episodeDate: format(values.episodeDate, 'yyyy-MM-dd'),
        tags: values.tags || [],
        linkedFilmId: values.linkedFilmId === 'none' ? null : values.linkedFilmId,
        linkedFilmSlug: linkedFilm ? linkedFilm.slug : null,
        disponibleEn: values.disponibleEn || [],
    };

    try {
        if (episodeToEdit) {
            const episodeRef = doc(firestore, 'afterglow', episodeToEdit.id);
            await updateDoc(episodeRef, dataToSave);
            toast({ title: 'Éxito', description: 'Publicación actualizada.' });
            router.push('/admin/archivoVisual');
        } else {
            await addDoc(collection(firestore, 'afterglow'), {
                ...dataToSave,
                createdAt: serverTimestamp()
            });
            toast({ title: 'Éxito', description: 'Publicación añadida al catálogo.' });
            form.reset();
            router.push('/admin/archivoVisual');
        }
    } catch (err: any) {
        if (err.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: episodeToEdit ? `afterglow/${episodeToEdit.id}` : 'afterglow',
                operation: episodeToEdit ? 'update' : 'create',
                requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
        } else {
             toast({ variant: 'destructive', title: 'Error', description: `No se pudo guardar la publicación: ${err.message}` });
        }
    } finally {
        setLoading(false);
    }
  }

  const filmOptions = [
    { value: 'none', label: 'Ninguna película vinculada' },
    ...allFilms.map(film => ({
        value: film.id,
        label: `${film.titulo} (${film.año})`
    }))
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Título de la Publicación</FormLabel>
                <FormControl><Input placeholder="Título del post" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="postUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL del Post</FormLabel>
                <FormControl><Input placeholder="https://www.instagram.com/p/..." {...field} /></FormControl>
                <FormDescription>URL completa de Instagram/TikTok.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="linkedFilmId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-2 mb-2">
                <FilmIcon className="w-4 h-4" />
                Vincular a Película de "El Salón"
              </FormLabel>
              <Combobox
                options={filmOptions}
                value={field.value || 'none'}
                onValueChange={field.onChange}
                placeholder="Escribe para buscar una película..."
                emptyMessage="No se encontró ninguna película."
                searchPlaceholder="Buscar película por título..."
                className="w-full"
                icon={<FilmIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
              />
              <FormDescription>
                Busca y selecciona una película para vincularla automáticamente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {linkedFilmId === 'none' && (
            <Card className="p-6 border-dashed bg-muted/30">
                <FormLabel>Dónde Ver (Enlaces Manuales)</FormLabel>
                <FormDescription className="mb-4">Si no vinculas a una película, puedes añadir enlaces directos aquí.</FormDescription>
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-background">
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
                                        <FormLabel>Enlace</FormLabel>
                                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-5 w-5 text-destructive"/>
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ plataforma: '', link: '' })}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Plataforma Manual
                    </Button>
                </div>
            </Card>
        )}

        <FormField
            control={form.control}
            name="tags"
            render={() => (
                <FormItem>
                    <FormLabel>Etiquetas</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedTags.map((tag: string) => (
                            <Badge key={tag} className="text-sm py-1 px-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                                {tag}
                                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 rounded-full outline-none">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <FormControl>
                        <div className="relative">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Añadir etiqueta..."
                                    value={tagInput}
                                    onChange={handleTagInputChange}
                                    onKeyDown={handleTagKeyDown}
                                />
                                <Button type="button" onClick={() => handleAddTag(tagInput)}>Añadir</Button>
                            </div>
                            {suggestions.length > 0 && (
                                <Card className="absolute z-10 w-full mt-2 p-2 bg-background border border-border">
                                    {suggestions.map(suggestion => (
                                        <Button key={suggestion} type="button" variant="ghost" size="sm" className="w-full justify-start" onClick={() => handleAddTag(suggestion)}>
                                            {suggestion}
                                        </Button>
                                    ))}
                                </Card>
                            )}
                        </div>
                    </FormControl>
                </FormItem>
            )}
        />

         <FormField
          control={form.control}
          name="episodeDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de Publicación</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "d 'de' MMMM, yyyy", { locale: es })
                      ) : (
                        <span>Elige una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 min-w-[280px]" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    locale={es}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={loading} size="lg">
          {loading ? 'Guardando...' : episodeToEdit ? 'Guardar Cambios' : 'Añadir Publicación'}
        </Button>
      </form>
    </Form>
  );
}
