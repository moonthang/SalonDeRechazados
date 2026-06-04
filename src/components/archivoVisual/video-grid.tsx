'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import type { AfterglowEpisode } from "@/lib/types";
import PostCard from "./video-card";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFirestore } from "@/firebase";
import { collection, getDocs, query, orderBy, limit, startAfter, where, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Film, ArrowUpRight, PlayCircle } from "lucide-react";

type PostGridProps = {
    selectedTag: string;
}

const PAGE_SIZE = 6;

export default function PostGrid({ selectedTag }: PostGridProps) {
    const [episodes, setEpisodes] = useState<AfterglowEpisode[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    const firestore = useFirestore();
    const observer = useRef<IntersectionObserver>();

    const fetcher = useCallback(async (tag: string, startAfterDoc: QueryDocumentSnapshot<DocumentData> | null) => {
        if (!firestore) return { newEpisodes: [], newLastDoc: null, newHasMore: false };

        try {
            const episodesRef = collection(firestore, 'afterglow');
            
            const filter = tag !== 'Todos' ? [where('tags', 'array-contains', tag)] : [];
            const order = tag === 'Todos' ? [orderBy('createdAt', 'desc')] : [];
            const pagination = startAfterDoc ? [startAfter(startAfterDoc)] : [];
            const sizeLimit = [limit(PAGE_SIZE)];

            const q = query(episodesRef, ...filter, ...order, ...pagination, ...sizeLimit);

            const querySnapshot = await getDocs(q);
            
            const newEpisodes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AfterglowEpisode));
            
            const newHasMore = newEpisodes.length === PAGE_SIZE;
            const newLastDoc = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

            return { newEpisodes, newLastDoc, newHasMore };
        } catch (error) {
            return { newEpisodes: [], newLastDoc: null, newHasMore: false };
        }
    }, [firestore]);
    
    useEffect(() => {
        setLoading(true);
        setEpisodes([]);
        setLastDoc(null);
        setHasMore(true);

        fetcher(selectedTag, null).then(({ newEpisodes, newLastDoc, newHasMore }) => {
            setEpisodes(newEpisodes);
            setLastDoc(newLastDoc);
            setHasMore(newHasMore);
            setLoading(false);
        });

    }, [selectedTag, fetcher]);

    const loadMoreEpisodes = useCallback(() => {
        if (loading || loadingMore || !hasMore || !lastDoc) return;

        setLoadingMore(true);
        fetcher(selectedTag, lastDoc).then(({ newEpisodes, newLastDoc, newHasMore }) => {
            setEpisodes(prev => [...prev, ...newEpisodes]);
            setLastDoc(newLastDoc);
            setHasMore(newHasMore);
            setLoadingMore(false);
        });

    }, [loading, loadingMore, hasMore, lastDoc, selectedTag, fetcher]);


    const lastEpisodeElementRef = useCallback((node: HTMLDivElement) => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreEpisodes();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore, loadMoreEpisodes]);
    
    const isValidDate = (dateString: string): boolean => {
        if (!dateString) return false;
        const date = parseISO(dateString.replace(/-/g, '/'));
        return !isNaN(date.getTime());
    };

    if (loading) {
         return (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`skeleton-${i}`}>
                        <Skeleton className="aspect-[4/5] w-full" />
                        <Skeleton className="h-5 w-3/4 mt-4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                    </div>
                ))}
             </div>
        );
    }

    if (episodes.length === 0) {
        return (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No se encontraron publicaciones con la etiqueta seleccionada.</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {episodes.map((episode, index) => (
                <div key={`${episode.id}-${index}`} ref={index === episodes.length - 1 ? lastEpisodeElementRef : null}>
                    <PostCard episode={episode} />
                    <div className="mt-4 space-y-3">
                        <div>
                            <h3 className="font-semibold text-base leading-tight">{episode.title}</h3>
                            {isValidDate(episode.episodeDate) && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {format(parseISO(episode.episodeDate), "d 'de' MMMM, yyyy", { locale: es })}
                                </p>
                            )}
                        </div>

                        {(episode.linkedFilmSlug || (episode.disponibleEn && episode.disponibleEn.length > 0)) && (
                            <div className="pt-1 space-y-3">
                                {episode.linkedFilmSlug ? (
                                    <Button asChild variant="secondary" size="sm" className="w-full group">
                                        <Link href={`/salon/${episode.linkedFilmSlug}`}>
                                            <Film className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                                            Ver en El Salón
                                            <ArrowUpRight className="ml-auto h-3 w-3 opacity-50" />
                                        </Link>
                                    </Button>
                                ) : episode.disponibleEn && episode.disponibleEn.length > 0 && (
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Ver en:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {episode.disponibleEn.map((platform, i) => (
                                                <Link key={i} href={platform.link || '#'} target="_blank" rel="noopener noreferrer">
                                                    <Badge variant="outline" className="text-[10px] hover:bg-primary/10 hover:border-primary/50 transition-colors py-0.5">
                                                        <PlayCircle className="w-3 h-3 mr-1" />
                                                        {platform.plataforma}
                                                    </Badge>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
             {loadingMore && Array.from({ length: 3 }).map((_, i) => (
                <div key={`loading-more-skeleton-${i}`}>
                    <Skeleton className="aspect-[4/5] w-full" />
                    <Skeleton className="h-5 w-3/4 mt-4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
            ))}
        </div>
    );
}
