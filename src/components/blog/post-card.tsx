import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Post } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/bitacora/${post.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 glass-card">
        {post.coverImage && (
          <div className="aspect-video relative">
            <Image
              src={post.coverImage.url}
              alt={`Portada de ${post.title}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-2">
            {format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
          </p>
          <h3 className="text-xl font-bold font-headline mb-3 leading-snug">{post.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
        </div>
      </Card>
    </Link>
  );
}