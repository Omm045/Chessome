'use client';

import { useEffect, ReactNode } from 'react';
import { useUIStore } from '../store/useUIStore';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useUIStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}
