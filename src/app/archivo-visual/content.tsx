'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PostGrid from '@/components/archivoVisual/video-grid';
import { Youtube, Search, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

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
    const [searchQuery, setSearchQuery] = useState('');

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
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar en el archivo..." 
                            className="pl-10 h-12 bg-background/50 border-white/10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Card className="glass-card flex-grow">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <Tag className="w-4 h-4 text-primary" />
                                Etiquetas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1">
                            <Button
                                variant={'ghost'}
                                onClick={() => setSelectedTag('Todos')}
                                className={cn(
                                    "w-full justify-start h-9 text-sm",
                                    selectedTag === 'Todos' && 'bg-primary/10 text-primary hover:bg-primary/20'
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
                                        "w-full justify-start h-9 text-sm",
                                        selectedTag === tag && 'bg-primary/10 text-primary hover:bg-primary/20'
                                    )}
                                >
                                    {tag}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <PostGrid selectedTag={selectedTag} searchQuery={searchQuery} />
        </>
    )
}
