'use client';

import { FavoritesProvider } from '@/store/FavoritesProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <FavoritesProvider>{children}</FavoritesProvider>;
}
