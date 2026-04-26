'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import type { AfterglowEpisode } from "@/lib/types";
import PostCard from "./video-card";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFirestore } from "@/firebase";
import { collection, getDocs, query, orderBy, limit, startAfter, where, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";

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
                    <div className="mt-4">
                        <h3 className="font-semibold text-base">{episode.title}</h3>
                        {isValidDate(episode.episodeDate) && (
                            <p className="text-sm text-muted-foreground">
                                {format(parseISO(episode.episodeDate), "d 'de' MMMM, yyyy", { locale: es })}
                            </p>
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
