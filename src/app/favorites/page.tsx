import type { Metadata } from 'next';
import { FavoritesView } from '@/components/FavoritesView';

export const metadata: Metadata = {
  title: 'Favorieten',
  description: 'Your saved Chuck Norris jokes — up to 10 favorites.',
};

export default function Page() {
  return <FavoritesView />;
}
