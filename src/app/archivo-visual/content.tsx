'use client';

import { useState } from 'react';
import type { AfterglowEpisode } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PostGrid from '@/components/archivoVisual/video-grid';
import { Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';

type ArchivoVisualContentProps = {
    tags: string[];
    featuredArchiveVideoUrl?: string;
}

const getYouTubeEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        let videoId = null;
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            videoId = urlObj.searchParams.get('v');
        } else if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        }
        
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    } catch (e) {
        // empty
    }
    return null;
};


export default function ArchivoVisualContent({ tags, featuredArchiveVideoUrl }: ArchivoVisualContentProps) {
    const [selectedTag, setSelectedTag] = useState('Todos');

    const embedUrl = getYouTubeEmbedUrl(featuredArchiveVideoUrl);

    return (
        <>
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
                <div className="lg:col-span-2 relative aspect-video rounded-2xl overflow-hidden bg-black border border-border">
                    {embedUrl ? (
                         <iframe
                            src={embedUrl}
                            title="Featured YouTube Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    ) : (
                        <Image 
                            src="https://ik.imagekit.io/axct8mpp27/Screenshots/SRD_Banner_TV.jpg?updatedAt=1776110696892" 
                            fill
                            alt="Featured Archive Video Placeholder" 
                            className="object-cover opacity-75"
                        />
                    )}
                     <div className="absolute bottom-4 right-4 bg-black/50 text-white rounded-full p-2">
                        <Youtube className="w-6 h-6" />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <Card className="glass-card h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                Etiquetas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Button
                                variant={'ghost'}
                                onClick={() => setSelectedTag('Todos')}
                                className={cn(
                                    "w-full justify-start",
                                    selectedTag === 'Todos' && 'bg-accent text-primary'
                                )}
                            >
                                Todas las etiquetas
                            </Button>
                            {tags.map(tag => (
                                <Button
                                    key={tag}
                                    variant={'ghost'}
                                    onClick={() => setSelectedTag(tag)}
                                    className={cn(
                                        "w-full justify-start",
                                        selectedTag === tag && 'bg-accent text-primary'
                                    )}
                                >
                                    {tag}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <PostGrid selectedTag={selectedTag} />
        </>
    )
}
