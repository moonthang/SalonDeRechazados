import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import InstagramIcon from "@/components/icons/instagram";
import YouTubeIcon from "@/components/icons/youtube";
import Link from "next/link";
import Image from "next/image";

const socialPlatforms = [
  {
    name: "Instagram",
    icon: InstagramIcon,
    handle: "@salonderechazados",
    cta: "Síguenos",
    url: "https://www.instagram.com/salonderechazados/",
  },
  {
    name: "TikTok",
    icon: "https://ik.imagekit.io/axct8mpp27/Screenshots/tiktok-6338432_960_720.webp",
    handle: "@_miguelburgos",
    cta: "Descubre",
    url: "https://www.tiktok.com/@_miguelburgos",
  },
  {
    name: "YouTube",
    icon: YouTubeIcon,
    handle: "@salonderechazados",
    cta: "Suscríbete",
    url: "https://www.youtube.com/@salonderechazados",
  },
];

export default function SocialHub() {
  return (
    <section 
      className="text-center relative pb-16 md:pb-24 overflow-hidden"
      style={{
        backgroundImage: "url('https://ik.imagekit.io/axct8mpp27/Screenshots/SRD_Banner_TV.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />
      <div className="container mx-auto px-4 relative z-10 pt-16 md:pt-24">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white">
          Salón de Rechazados Films
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-white/80 mb-12">
          Un proyecto para hablar de cine.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            const url = platform.url;
            return (
              <Card
                key={platform.name}
                className="glass-card group relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
              >
                <Link href={url} target="_blank" rel="noopener noreferrer" className="block p-8">
                  <CardContent className="flex flex-col items-center justify-center text-center p-0">
                    {typeof Icon === 'string' ? (
                      <div className="relative w-12 h-12 mb-4 flex items-center justify-center">
                        <Image src={Icon} alt={`${platform.name} logo`} width={48} height={48} className="object-contain" />
                      </div>
                    ) : (
                      <Icon className="w-12 h-12 mb-4 text-primary" />
                    )}
                    <h3 className="text-2xl font-bold font-headline">{platform.name}</h3>
                    <p className="text-muted-foreground">{platform.handle}</p>
                    <Button variant="ghost" className="mt-4 group-hover:text-primary">
                      {platform.cta}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
