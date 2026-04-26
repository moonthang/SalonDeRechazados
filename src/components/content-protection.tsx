'use client';

import { useEffect } from 'react';

export default function ContentProtection() {
  useEffect(() => {
    const preventImageActions = (e: Event) => {
      if (e.target && (e.target as HTMLElement).tagName.toUpperCase() === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventImageActions);
    document.addEventListener('dragstart', preventImageActions);

    return () => {
      document.removeEventListener('contextmenu', preventImageActions);
      document.removeEventListener('dragstart', preventImageActions);
    };
  }, []);

  return null;
}
