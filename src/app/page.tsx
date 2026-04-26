import SocialHub from '@/components/home/social-hub';
import LatestAfterglow from '@/components/home/latest-afterglow';
import LatestFilms from '@/components/home/latest-films';
import ProjectSummary from '@/components/home/project-summary';
import { Separator } from '@/components/ui/separator';
import { getConfig, getFilms } from '@/lib/firestore';
import { getPosts } from '@/lib/hygraph';
import LatestPosts from '@/components/home/latest-posts';
import Image from 'next/image';

export const revalidate = 60;

export default async function Home() {
  const [config, films, posts] = await Promise.all([
    getConfig(),
    getFilms(6),
    getPosts(4),
  ]);

  return (
    <div>
      <SocialHub />
      <div className="container mx-auto px-4 pb-24 sm:pb-32">
        <div className="flex flex-col gap-16 md:gap-24">
          <Separator className="bg-white/10" />
          <LatestAfterglow item={config?.featuredItem} />
          <Separator className="bg-white/10" />
          <LatestFilms films={films} />
          {posts && posts.length > 0 && (
            <>
              <Separator className="bg-white/10" />
              <LatestPosts posts={posts} />
            </>
          )}
          {config?.homeBannerUrl && (
            <section>
              <div className="relative aspect-[16/7] rounded-2xl overflow-hidden shadow-lg border border-border">
                <Image 
                  src={config.homeBannerUrl} 
                  alt="Banner" 
                  fill 
                  className="object-cover"
                />
              </div>
            </section>
          )}
          <ProjectSummary about={config?.aboutUsContent} />
        </div>
      </div>
    </div>
  );
}
