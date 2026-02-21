import type { JokeItem } from '@/lib/types';

/**
 * Adds a new item and ensures the list never exceeds maxItems.
 * For the rolling list we assume fetchedAt is always set.
 * If it isn't, we treat it as "newest" by using Number.MAX_SAFE_INTEGER.
 */
export function addAndTrimByFetchedAt(
  prev: JokeItem[],
  nextItem: JokeItem,
  maxItems = 10,
): JokeItem[] {
  const combined = [...prev, nextItem];

  if (combined.length <= maxItems) return combined;

  // Helper: convert optional fetchedAt to a comparable number
  const ts = (item: JokeItem) => item.fetchedAt ?? Number.MAX_SAFE_INTEGER;

  let oldestIndex = 0;
  for (let i = 1; i < combined.length; i++) {
    if (ts(combined[i]) < ts(combined[oldestIndex])) {
      oldestIndex = i;
    }
  }

  combined.splice(oldestIndex, 1);
  return combined;
}
