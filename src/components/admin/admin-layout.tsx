import { AuthProvider } from '@/components/auth-provider';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Clapperboard, Film, Home, LogOut, Video } from 'lucide-react';
import Logo from '../logo';
import Link from 'next/link';
import { LogoutButton } from './logout-button';

const adminNavLinks = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/salon', label: 'El Salón', icon: Film },
    { href: '/admin/archivoVisual/featured', label: 'Video Destacado', icon: Clapperboard },
    { href: '/admin/archivoVisual', label: 'Catálogo Visual', icon: Video },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
      <AuthProvider>
        <SidebarProvider>
          <Sidebar>
            <div className='p-4'>
                <Logo />
            </div>
            <SidebarMenu className="p-2">
                {adminNavLinks.map(link => {
                    const Icon = link.icon;
                    return (
                        <SidebarMenuItem key={link.href}>
                            <Link href={link.href} className='w-full'>
                                <SidebarMenuButton className='w-full justify-start'>
                                    <Icon className='w-4 h-4 mr-2' />
                                    <span>{link.label}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
            <div className='flex-grow' />
            <div className='p-2'>
              <LogoutButton />
            </div>
          </Sidebar>
          <main className="flex-1 bg-background">
            <div className="p-8">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </AuthProvider>
    );
  }
  