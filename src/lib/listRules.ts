import type { JokeItem } from '@/lib/types';

/**
 * Adds a new item and ensures the list never exceeds maxItems.
 * The "oldest" item is determined by our own `fetchedAt` timestamp,
 * not by API fields like created_at/updated_at.
 */
export function addAndTrimByFetchedAt(
  prev: JokeItem[],
  nextItem: JokeItem,
  maxItems = 10,
): JokeItem[] {
  const combined = [...prev, nextItem];

  // If we didn't exceed the max, we're done.
  if (combined.length <= maxItems) return combined;

  // Find the oldest item by lowest fetchedAt and remove it.
  let oldestIndex = 0;
  for (let i = 1; i < combined.length; i++) {
    if (combined[i].fetchedAt < combined[oldestIndex].fetchedAt) {
      oldestIndex = i;
    }
  }

  combined.splice(oldestIndex, 1);
  return combined;
}
