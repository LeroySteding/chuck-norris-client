'use client';

import { JokeCard } from '@/components/JokeCard';
import { EmptyState } from '@/components/EmptyState';
import { useFavorites } from '@/store/FavoritesProvider';

export default function FavoritesPage() {
  const { favorites, remove, count, max } = useFavorites();

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-5">
        <h1 className="text-[28px] font-bold text-content">Favorieten</h1>
        <p className="mt-0.5 text-sm text-muted">
          {count} / {max} opgeslagen
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {favorites.map((joke) => (
            <JokeCard
              key={joke.id}
              item={{ joke }}
              showFetchedAt={false}
              actions={
                <button
                  type="button"
                  onClick={() => remove(joke.id)}
                  className="shrink-0 rounded-lg border border-danger px-3 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
                >
                  Remove
                </button>
              }
            />
          ))}
        </ul>
      )}
    </main>
  );
}
