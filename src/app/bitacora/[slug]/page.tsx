import { getPostBySlug, getPostSlugs } from '@/lib/hygraph';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Metadata } from 'next';
import BackButton from '@/components/blog/back-button';

type Props = {
  params: { slug: string };
};

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map(({ slug }) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Artículo no encontrado',
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
        title: `${post.title} | Salón de Rechazados`,
        description: post.excerpt,
        images: [
            {
                url: post.coverImage.url,
                width: 1200,
                height: 630,
                alt: `Portada de ${post.title}`,
            },
        ],
        type: 'article',
        publishedTime: post.publishedAt,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 sm:py-16 max-w-4xl">
      <BackButton />
      <div className="text-center mb-12">
        <p className="text-base text-primary mb-2">
            {format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          {post.title}
        </h1>
      </div>

      {post.coverImage && (
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-border mb-12">
            <Image
                src={post.coverImage.url}
                alt={`Portada de ${post.title}`}
                fill
                className="object-cover"
                priority
            />
        </div>
      )}
      
      <div 
        className="prose prose-lg dark:prose-invert mx-auto w-full max-w-none
                   prose-headings:font-headline prose-headings:tracking-tighter prose-headings:text-foreground
                   prose-p:text-foreground/80
                   prose-a:text-primary hover:prose-a:text-primary/80
                   prose-strong:text-foreground
                   prose-blockquote:border-l-primary"
        dangerouslySetInnerHTML={{ __html: post.content.html }} 
      />

    </article>
  );
}
