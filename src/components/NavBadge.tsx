'use client';

import { useFavorites } from '@/store/FavoritesProvider';

export function NavBadge() {
  const { count, max } = useFavorites();

  return (
    <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-xs leading-none text-white">
      {count}/{max}
    </span>
  );
}
