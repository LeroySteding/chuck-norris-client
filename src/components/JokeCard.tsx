import type { JokeItem } from '@/lib/types';

export function JokeCard({ item }: { item: JokeItem }) {
  return (
    <li className="rounded-lg border p-4">
      <p className="text-sm leading-6">{item.joke.value}</p>
      <div className="mt-2 text-xs opacity-70">
        Fetched: {new Date(item.fetchedAt).toLocaleTimeString()}
      </div>
    </li>
  );
}
