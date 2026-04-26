import { getPosts } from '@/lib/hygraph';
import BitacoraContent from '@/components/blog/bitacora-content';
import Image from 'next/image';

export const revalidate = 60;

export default async function BitacoraPage() {
  const posts = await getPosts();
  const tags = [...new Set(posts.flatMap((post) => post.tags || []))].sort();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
      <div className="text-center mb-12 relative overflow-visible">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter relative z-10">
          Bitácora
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto relative z-10">
          Artículos, reflexiones y notas sobre cine, creatividad y el proceso detrás de Salón de Rechazados.
        </p>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 md:translate-x-12 opacity-20 -z-10 pointer-events-none">
          <Image
            src="https://ik.imagekit.io/axct8mpp27/Screenshots/SDR_Logo2(V1)-sticker.png"
            alt="Bitácora Sticker"
            width={130}
            height={130}
            className="object-contain"
            priority
          />
        </div>
      </div>
      <BitacoraContent posts={posts} tags={tags} />
    </div>
  );
}