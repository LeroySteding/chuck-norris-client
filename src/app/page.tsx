'use client';

import { useEffect, useState } from 'react';
import { fetchRandomJoke } from '@/lib/chuckApi';
import type { JokeItem } from '@/lib/types';
import { JokeList } from '@/components/JokeList';

export default function HomePage() {
  /**
   * Holds the 10 jokes currently visible in the UI.
   * We wrap the API joke inside a JokeItem to add our own metadata:
   * - fetchedAt: used to determine "oldest" later (NOT created_at from API)
   */
  const [items, setItems] = useState<JokeItem[]>([]);

  /** Loading state for initial fetch */
  const [loading, setLoading] = useState(true);

  /** Error state for API failures */
  const [error, setError] = useState<string | null>(null);

  /**
   * Load 10 random jokes when the page mounts.
   *
   * We define the async function INSIDE useEffect.
   * This avoids dependency issues and removes the need to disable ESLint rules.
   */
  useEffect(() => {
    const controller = new AbortController();

    async function loadInitial() {
      try {
        setLoading(true);
        setError(null);

        /**
         * Fetch 10 jokes in parallel.
         * Promise.all ensures we wait for all of them.
         */
        const jokes = await Promise.all(
          Array.from({ length: 10 }, () =>
            fetchRandomJoke(controller.signal),
          ),
        );

        /**
         * Add fetchedAt timestamp.
         * We do NOT rely on joke.created_at because
         * the assignment says "oldest !== joke.created_at".
         */
        const now = Date.now();

        const enriched: JokeItem[] = jokes.map((joke, index) => ({
          joke,
          fetchedAt: now + index, // ensures stable ordering
        }));

        setItems(enriched);
      } catch (err) {
        /**
         * If the component unmounts, AbortController triggers.
         * We ignore AbortError as it's expected behaviour.
         */
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        setError(
          err instanceof Error ? err.message : 'Unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    }

    void loadInitial();

    /**
     * Cleanup:
     * If component unmounts while request is in flight,
     * abort it to prevent state update on unmounted component.
     */
    return () => {
      controller.abort();
    };
  }, []); // empty dependency array = run once on mount

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Jokes</h1>

      {loading && (
        <div className="mt-4 rounded border p-4 text-sm opacity-70">
          Loading...
        </div>
      )}

      {error && (
        <div className="mt-4 rounded border p-4 text-sm">
          Error: {error}
        </div>
      )}

      {!loading && !error && <JokeList items={items} />}
    </main>
  );
}
