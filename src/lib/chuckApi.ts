export type ChuckJoke = {
  id: string;
  value: string;
  url: string;
  icon_url: string;
  categories?: string[];
  created_at: string;
  updated_at: string;
};

const API_BASE = 'https://api.chucknorris.io';

export async function fetchRandomJoke(signal?: AbortSignal): Promise<ChuckJoke> {
  const res = await fetch(`${API_BASE}/jokes/random`, {
    signal,
    // random endpoint: avoid any caching surprises
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch random joke (${res.status})`);
  }

  const data = (await res.json()) as ChuckJoke;

  // tiny runtime validation (cheap + "production ready" feel)
  if (!data?.id || !data?.value) {
    throw new Error('Invalid joke response');
  }

  return data;
}
