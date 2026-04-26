'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();
  return (
    <Button variant="outline" size="icon" onClick={() => router.back()} className="mb-8 rounded-full">
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Volver a Bitácora</span>
    </Button>
  );
}