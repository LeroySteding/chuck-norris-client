'use client';

import { JokeCard } from '@/components/JokeCard';
import { useFavorites } from '@/store/FavoritesProvider';

export default function FavoritesPage() {
  const { favorites, remove, count, max } = useFavorites();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Favorieten</h1>
      <p className="mt-1 text-sm opacity-80">
        {count} / {max} opgeslagen
      </p>

      {favorites.length === 0 ? (
        <div className="mt-6 rounded-lg border p-4 text-sm opacity-80">
          Nog geen favorieten.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {favorites.map((joke) => (
            <JokeCard
              key={joke.id}
              item={{ joke }}
              showFetchedAt={false}
              actions={
                <button
                  type="button"
                  onClick={() => remove(joke.id)}
                  className="shrink-0 rounded-md border px-3 py-2 text-sm hover:bg-black/5"
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
