import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-6 border-t border-white/10">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>
          <Link href="/admin/login" className="hover:text-primary transition-colors">
            Salón de Rechazados Films &copy; {new Date().getFullYear()}
          </Link>
        </p>
      </div>
    </footer>
  );
}
