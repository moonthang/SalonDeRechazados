import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import PostCard from "@/components/blog/post-card";
import type { Post } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type LatestPostsProps = {
  posts: Post[];
};

export default function LatestPosts({ posts }: LatestPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            Últimas Entradas de la Bitácora
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Nuestros últimos artículos, reflexiones y notas sobre cine.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/bitacora">
            Ver todo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: posts.length > 3,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-6">
          {posts.map((post) => (
            <CarouselItem key={post.slug} className="pl-6 md:basis-1/2 lg:basis-1/3">
              <PostCard post={post} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
}
