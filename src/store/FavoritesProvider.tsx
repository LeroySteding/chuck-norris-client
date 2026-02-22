'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ChuckJoke } from '@/lib/chuckApi';
import {
  favoritesRules,
  isFavorite,
  loadFavorites,
  removeFavorite,
  saveFavorites,
  toggleFavorite,
} from '@/store/favorites';

/**
 * Context shape.
 * We expose:
 * - favorites list
 * - count (derived value)
 * - isFavorite checker
 * - toggle + remove actions
 */
type FavoritesContextValue = {
  favorites: ChuckJoke[];
  count: number;
  isFavorite: (id: string) => boolean;
  toggle: (joke: ChuckJoke) => { blockedByLimit: boolean };
  remove: (id: string) => void;
  max: number;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  /**
   * State container for favorites.
   *
   * We start with empty array to avoid hydration mismatch.
   * Actual persisted data is loaded in useEffect.
   */
  const [favorites, setFavorites] = useState<ChuckJoke[]>([]);

  /**
   * Load persisted favorites once on mount.
   *
   * Why inside useEffect:
   * - localStorage is browser-only
   * - avoids SSR issues
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(loadFavorites());
  }, []);

  /**
   * Persist favorites whenever state changes.
   *
   * Dependency array ensures this runs only when favorites updates.
   */
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  /**
   * useMemo explanation:
   *
   * Without useMemo:
   * - A new object would be created on every render.
   * - All context consumers would re-render unnecessarily.
   *
   * With useMemo:
   * - Value object is stable unless favorites changes.
   * - Prevents needless re-renders.
   */
  const value = useMemo<FavoritesContextValue>(() => {
    return {
      favorites,
      count: favorites.length,
      max: favoritesRules.MAX_FAVORITES,

      isFavorite: (id) => isFavorite(favorites, id),

      toggle: (joke) => {
        const result = toggleFavorite(favorites, joke);
        setFavorites(result.favorites);
        return { blockedByLimit: result.blockedByLimit };
      },

      remove: (id) => setFavorites((prev) => removeFavorite(prev, id)),
    };
  }, [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

/**
 * Custom hook for accessing favorites.
 *
 * Throws error if used outside provider,
 * making misuse easier to debug.
 */
export function useFavorites() {
  const ctx = useContext(FavoritesContext);

  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }

  return ctx;
}
