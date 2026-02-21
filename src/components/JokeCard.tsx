'use client';

import type { JokeItem } from '@/lib/types';
import { useFavorites } from '@/store/FavoritesProvider';

type JokeCardProps = {
  item: JokeItem;

  /**
   * Whether to show our local "fetchedAt" timestamp.
   * On the favorites page we usually don't need this.
   */
  showFetchedAt?: boolean;

  /**
   * Optional custom action area.
   * If provided, we render this instead of the default favorite toggle.
   */
  actions?: React.ReactNode;
};

export function JokeCard({ item, showFetchedAt = true, actions }: JokeCardProps) {
  const { isFavorite, toggle } = useFavorites();

  // If custom actions are provided, we won't use the default favorite button.
  const fav = isFavorite(item.joke.id);

  return (
    <li className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm leading-6">{item.joke.value}</p>

        {actions ? (
          actions
        ) : (
          <button
            type="button"
            onClick={() => {
              const res = toggle(item.joke);
              if (res.blockedByLimit) alert('Maximaal 10 favorieten toegestaan.');
            }}
            className="shrink-0 rounded-md border px-2 py-1 text-sm hover:bg-black/5"
            aria-pressed={fav}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            title={fav ? 'Unfavorite' : 'Favorite'}
          >
            {fav ? '★' : '☆'}
          </button>
        )}
      </div>

      {showFetchedAt && item.fetchedAt != null && (
        <div className="mt-2 text-xs opacity-70">
          Fetched: {new Date(item.fetchedAt).toLocaleTimeString()}
        </div>
      )}
    </li>
  );
}
