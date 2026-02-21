'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchRandomJoke } from '@/lib/chuckApi';
import type { JokeItem } from '@/lib/types';
import { JokeList } from '@/components/JokeList';
import { addAndTrimByFetchedAt } from '@/lib/listRules';

export default function HomePage() {
  const [items, setItems] = useState<JokeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Whether the 5s interval is active */
  const [isRunning, setIsRunning] = useState(false);

  /**
   * We keep a ref with the latest isRunning value.
   * Why: async fetch can resolve after you clicked "Stop".
   * The ref lets us ignore results if the user has stopped the timer.
   */
  const isRunningRef = useRef(false);
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  // 1) Initial load: fetch 10 jokes on mount
  useEffect(() => {
    const controller = new AbortController();

    async function loadInitial() {
      try {
        setLoading(true);
        setError(null);

        const jokes = await Promise.all(
          Array.from({ length: 10 }, () => fetchRandomJoke(controller.signal)),
        );

        const now = Date.now();
        const enriched: JokeItem[] = jokes.map((joke, index) => ({
          joke,
          fetchedAt: now + index,
        }));

        setItems(enriched);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    void loadInitial();

    return () => controller.abort();
  }, []);

  // 2) Timer effect: every 5s fetch 1 joke and update the rolling list (max 10)
  useEffect(() => {
    if (!isRunning) return;

    const controller = new AbortController();

    /**
     * We define the tick function once per effect run.
     * On each tick:
     * - fetch a random joke
     * - add it to list
     * - remove oldest if list exceeds 10
     */
    async function tick() {
      try {
        const joke = await fetchRandomJoke(controller.signal);

        // If user stopped in the meantime, ignore the result.
        if (!isRunningRef.current) return;

        const nextItem: JokeItem = { joke, fetchedAt: Date.now() };

        setItems((prev) => addAndTrimByFetchedAt(prev, nextItem, 10));
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        // Optional: surface the error without breaking the app
        setError(err instanceof Error ? err.message : 'Failed to fetch new joke');
      }
    }

    // Fire immediately (so user sees it working), then every 5 seconds
    void tick();
    const intervalId = window.setInterval(() => void tick(), 5000);

    return () => {
      window.clearInterval(intervalId);
      controller.abort();
    };
  }, [isRunning]);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Jokes</h1>
          <p className="mt-1 text-sm opacity-80">
            Timer voegt elke 5 seconden een random joke toe (max 10 zichtbaar).
          </p>
        </div>

        <button
          onClick={() => setIsRunning((v) => !v)}
          className="rounded-md border px-3 py-2 text-sm hover:bg-black/5"
        >
          {isRunning ? 'Stop timer' : 'Start timer'}
        </button>
      </div>

      {loading && (
        <div className="mt-6 rounded-lg border p-4 text-sm opacity-80">
          Loading...
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 rounded-lg border p-4 text-sm">
          <div className="font-medium">Error</div>
          <div className="mt-1 opacity-80">{error}</div>
        </div>
      )}

      {!loading && !error && <JokeList items={items} />}
    </main>
  );
}
