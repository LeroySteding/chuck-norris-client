import type { ChuckJoke } from '@/lib/chuckApi';

/**
 * Storage key versioned.
 * If we ever change the structure, we can bump this key.
 */
const STORAGE_KEY = 'chuck:favorites:v1';

/**
 * Business rule from assignment:
 * Maximum of 10 favorites.
 */
const MAX_FAVORITES = 10;

/**
 * Loads favorites from localStorage.
 *
 * Why:
 * - Favorites must persist across page refresh.
 * - localStorage is sufficient for this assignment.
 *
 * We guard against:
 * - SSR (window undefined)
 * - Invalid JSON
 * - Unexpected data shape
 */
export function loadFavorites(): ChuckJoke[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (j) => j && typeof j === 'object' && 'id' in j && 'value' in j,
    ) as ChuckJoke[];
  } catch {
    return [];
  }
}

/**
 * Persists favorites to localStorage.
 *
 * Called whenever favorites state changes.
 */
export function saveFavorites(favorites: ChuckJoke[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

/**
 * Checks if a joke is already a favorite.
 */
export function isFavorite(favorites: ChuckJoke[], id: string) {
  return favorites.some((j) => j.id === id);
}

/**
 * Toggles favorite state.
 *
 * Returns metadata:
 * - didAdd → whether item was added
 * - blockedByLimit → true if user tried to exceed max limit
 *
 * We do not mutate original array.
 */
export function toggleFavorite(
  favorites: ChuckJoke[],
  joke: ChuckJoke,
): {
  favorites: ChuckJoke[];
  didAdd: boolean;
  blockedByLimit: boolean;
} {
  const exists = isFavorite(favorites, joke.id);

  if (exists) {
    return {
      favorites: favorites.filter((j) => j.id !== joke.id),
      didAdd: false,
      blockedByLimit: false,
    };
  }

  if (favorites.length >= MAX_FAVORITES) {
    return { favorites, didAdd: false, blockedByLimit: true };
  }

  return {
    favorites: [...favorites, joke],
    didAdd: true,
    blockedByLimit: false,
  };
}

/**
 * Removes favorite by id.
 */
export function removeFavorite(favorites: ChuckJoke[], id: string) {
  return favorites.filter((j) => j.id !== id);
}

export const favoritesRules = {
  STORAGE_KEY,
  MAX_FAVORITES,
};
