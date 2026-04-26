import type { Timestamp } from 'firebase/firestore';

export type SocialLinks = {
  instagram: string;
  tiktok: string;
  youtube: string;
};

export type AfterglowEpisode = {
  id: string;
  title: string;
  postUrl: string;
  episodeDate: string;
  tags?: string[];
  createdAt: Timestamp;
};

export type FilmPlatform = {
  plataforma: string;
  link?: string;
};

export type Film = {
  id: string;
  slug: string;
  titulo: string;
  año: number;
  direccion: string;
  genero: string[];
  pais: string;
  duracion: number;
  disponibleEn: FilmPlatform[];
  sinopsis: string;
  posterUrl: string;
  screenshots?: string[];
  letterboxdUrl?: string;
  createdAt: Timestamp;
};

export type FeaturedItem = {
  coverUrl: string;
  director: string;
  movieTitle: string;
  watchOn: FilmPlatform[];
  videoUrl: string;
  description?: string;
};

export type Config = {
    socialLinks: SocialLinks;
    aboutUsContent: string;
    featuredItem?: FeaturedItem;
    featuredArchiveVideoUrl?: string;
    homeBannerUrl?: string;
}

export type Post = {
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  coverImage: {
    url: string;
  };
  content: {
    html: string;
  };
  tags?: string[];
};
