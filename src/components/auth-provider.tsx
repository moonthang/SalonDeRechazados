'use client';

import React, { useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, router, pathname]);

  useEffect(() => {
    const ensureAdminUserExists = async () => {
      if (user && firestore) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          try {
            await setDoc(userDocRef, {
              uid: user.uid,
              email: user.email,
              role: 'admin',
              displayName: user.displayName || user.email,
            });
          } catch (error) {
          }
        }
      }
    };

    if (!isUserLoading) {
      ensureAdminUserExists();
    }
  }, [user, isUserLoading, firestore]);

  if (isUserLoading || (!user && pathname !== '/admin/login')) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full bg-primary/20" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-primary/20" />
            <Skeleton className="h-4 w-[200px] bg-primary/20" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};