import { describe, expect, it } from 'vitest';
import type { ChuckJoke } from '@/lib/chuckApi';
import { toggleFavorite } from '@/store/favorites';

function joke(id: string): ChuckJoke {
  return {
    id,
    value: `joke-${id}`,
    url: '',
    icon_url: '',
    created_at: '',
    updated_at: '',
  };
}

describe('favorites', () => {
  it('toggles add/remove', () => {
    const favs: ChuckJoke[] = [];

    // add
    const r1 = toggleFavorite(favs, joke('a'));
    expect(r1.favorites).toHaveLength(1);

    // remove
    const r2 = toggleFavorite(r1.favorites, joke('a'));
    expect(r2.favorites).toHaveLength(0);
  });

  it('blocks adding more than 10', () => {
    const favs: ChuckJoke[] = Array.from({ length: 10 }, (_, i) => joke(String(i)));
    const r = toggleFavorite(favs, joke('11'));
    expect(r.blockedByLimit).toBe(true);
    expect(r.favorites).toHaveLength(10);
  });
});
