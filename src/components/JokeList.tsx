import type { JokeItem } from '@/lib/types';
import { JokeCard } from '@/components/JokeCard';

export function JokeList({ items }: { items: JokeItem[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <JokeCard key={`${item.joke.id}-${item.fetchedAt ?? 'fav'}`} item={item} />
      ))}
    </ul>
  );
}
