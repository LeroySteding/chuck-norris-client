'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchRandomJoke } from '@/lib/chuckApi';
import type { JokeItem } from '@/lib/types';
import { JokeList } from '@/components/JokeList';
import { SkeletonCard } from '@/components/SkeletonCard';
import { StatusPill } from '@/components/StatusPill';
import { addAndTrimByFetchedAt } from '@/lib/listRules';

const SKELETON_KEYS = ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5'];

export function JokesView() {
  const [items, setItems] = useState<JokeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const isRunningRef = useRef(false);
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  async function loadInitial(signal: AbortSignal) {
    try {
      setLoading(true);
      setError(null);
      const jokes = await Promise.all(Array.from({ length: 10 }, () => fetchRandomJoke(signal)));
      const now = Date.now();
      setItems(jokes.map((joke, i) => ({ joke, fetchedAt: now + i })));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void loadInitial(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const controller = new AbortController();

    async function tick() {
      try {
        const joke = await fetchRandomJoke(controller.signal);
        if (!isRunningRef.current) return;
        setItems((prev) => addAndTrimByFetchedAt(prev, { joke, fetchedAt: Date.now() }, 10));
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to fetch new joke');
      }
    }

    void tick();
    const intervalId = window.setInterval(() => void tick(), 5000);
    return () => {
      window.clearInterval(intervalId);
      controller.abort();
    };
  }, [isRunning]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-[28px] font-bold text-content">Jokes</h1>
        <p className="mt-1 text-sm text-muted">
          10 random jokes on load — timer adds one every 5 seconds (max 10).
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setIsRunning((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            {isRunning ? (
              <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zm5 0a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
            ) : (
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            )}
          </svg>
          {isRunning ? 'Stop Timer' : 'Start Timer'}
        </button>

        <button
          onClick={() => {
            const c = new AbortController();
            void loadInitial(c.signal);
          }}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-divider bg-surface px-3.5 py-2 text-sm font-medium text-content transition-colors hover:bg-surface-2 disabled:opacity-40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 text-muted"
          >
            <path
              fillRule="evenodd"
              d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
              clipRule="evenodd"
            />
          </svg>
          Refresh 10
        </button>

        <StatusPill status={isRunning ? 'running' : 'paused'} />
      </div>

      {/* Loading */}
      {loading && (
        <ul className="mt-4 space-y-3">
          {SKELETON_KEYS.map((id) => (
            <SkeletonCard key={id} />
          ))}
        </ul>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-6 rounded-xl border border-danger-soft bg-danger-soft p-4 text-sm">
          <p className="font-medium text-danger">Error</p>
          <p className="mt-1 text-muted">{error}</p>
        </div>
      )}

      {/* List */}
      {!loading && !error && <JokeList items={items} />}
    </main>
  );
}
