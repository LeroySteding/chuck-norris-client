'use client';

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import type { ChuckJoke } from '@/lib/chuckApi';
import {
  favoritesRules,
  isFavorite,
  loadFavorites,
  removeFavorite,
  saveFavorites,
  toggleFavorite,
} from '@/store/favorites';

/* ── External store ─────────────────────────────────────────────── */

let _cache: ChuckJoke[] | null = null;
const _listeners = new Set<() => void>();

function _invalidate() {
  _cache = null;
  _listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  _listeners.add(callback);
  const onStorage = () => {
    _cache = null;
    callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    _listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot(): ChuckJoke[] {
  return (_cache ??= loadFavorites());
}

function getServerSnapshot(): ChuckJoke[] {
  return [];
}

/* ── Context ────────────────────────────────────────────────────── */

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
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      count: favorites.length,
      max: favoritesRules.MAX_FAVORITES,

      isFavorite: (id) => isFavorite(favorites, id),

      toggle: (joke) => {
        const result = toggleFavorite(favorites, joke);
        saveFavorites(result.favorites);
        _invalidate();
        return { blockedByLimit: result.blockedByLimit };
      },

      remove: (id) => {
        saveFavorites(removeFavorite(favorites, id));
        _invalidate();
      },
    }),
    [favorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);

  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }

  return ctx;
}
