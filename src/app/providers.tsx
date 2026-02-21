'use client';

import { FavoritesProvider } from '@/store/FavoritesProvider';
import { ToastProvider } from '@/store/ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <ToastProvider>{children}</ToastProvider>
    </FavoritesProvider>
  );
}
