'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/logo';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { BookText, Film, Home, Info, Menu, Video } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/salon', label: 'El Salón', icon: Film },
  { href: '/bitacora', label: 'Bitácora', icon: BookText },
  { href: '/archivo-visual', label: 'Archivo Visual', icon: Video },
  { href: '/conocenos', label: 'Conócenos', icon: Info },
];

export default function Header() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (isAdminPage) {
    return null;
  }

  const renderNavLinks = (isMobile = false) => (
    navLinks.map((link) => {
      const Icon = link.icon;
      return (
        <Button
          key={link.href}
          asChild
          variant="link"
          className={cn(
            "text-muted-foreground hover:text-primary hover:no-underline transition-colors",
            pathname === link.href && "text-primary",
            isMobile && "text-lg w-full justify-start"
          )}
        >
          <Link href={link.href}>
            <Icon />
            {link.label}
          </Link>
        </Button>
      )
    })
  );

  return (
    <header className="z-50 bg-background/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {renderNavLinks()}
        </nav>
        <div className="md:hidden">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
              <div className="mt-8">
                <Link href="/" className="mb-8">
                  <Logo />
                </Link>
                <nav className="flex flex-col gap-4 mt-8">
                  {renderNavLinks(true)}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
