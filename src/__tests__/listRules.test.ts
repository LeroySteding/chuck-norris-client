import { describe, expect, it } from 'vitest';
import { addAndTrimByFetchedAt } from '@/lib/listRules';
import type { JokeItem } from '@/lib/types';

function makeItem(id: string, fetchedAt: number): JokeItem {
  return {
    fetchedAt,
    joke: {
      id,
      value: `joke-${id}`,
      url: '',
      icon_url: '',
      created_at: '',
      updated_at: '',
    },
  };
}

describe('addAndTrimByFetchedAt', () => {
  it('keeps max 10 items and removes the oldest by fetchedAt', () => {
    let items: JokeItem[] = [];

    // add 11 items
    for (let i = 0; i < 11; i++) {
      items = addAndTrimByFetchedAt(items, makeItem(String(i), i), 10);
    }

    expect(items).toHaveLength(10);

    // oldest fetchedAt=0 should be removed; remaining should include 1..10
    const ids = items.map((x) => x.joke.id).sort();
    expect(ids).toEqual(['1','10','2','3','4','5','6','7','8','9']);
  });
});
