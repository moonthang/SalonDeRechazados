import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { FirebaseClientProvider } from '@/firebase';
import { Inter, Syne } from 'next/font/google';
import { cn } from '@/lib/utils';
import ContentProtection from '@/components/content-protection';
import ScrollToTop from '@/components/scroll-to-top';
import { Analytics } from '@vercel/analytics/next';

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const fontHeadline = Syne({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
  variable: '--font-headline',
});

const siteUrl = 'https://salon-de-rechazados.vercel.app';
const siteTitle = 'Salón de Rechazados | Análisis de Películas y Ensayos de Cine';
const siteDescription = 'Explora análisis de películas, video-ensayos y críticas de cine. Un espacio para los que sienten el cine, más allá de las reseñas convencionales.';
const siteImage = 'https://ik.imagekit.io/axct8mpp27/Screenshots/portadaProjectsSDR.png';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | Salón de Rechazados',
  },
  description: siteDescription,
  keywords: ['análisis de películas', 'crítica de cine', 'cine independiente', 'video-ensayos', 'Salón de Rechazados', 'cine colombiano'],
  verification: {
    google: 'ctA8c1Hwfjza4OWtLciZ2Pn_ylpzDmwTKZmIEXYUNoA',
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: 'Salón de Rechazados',
    images: [
      {
        url: siteImage,
        width: 1200,
        height: 630,
        alt: 'Portada de Salón de Rechazados',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [siteImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn('dark', fontBody.variable, fontHeadline.variable)}>
      <head />
      <body className="font-body">
        <FirebaseClientProvider>
          <ContentProtection />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <ScrollToTop />
          <Toaster />
        </FirebaseClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
