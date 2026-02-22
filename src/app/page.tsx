import type { Metadata } from 'next';
import { JokesView } from '@/components/JokesView';

export const metadata: Metadata = {
  title: 'Jokes',
  description: '10 random Chuck Norris jokes on load — timer adds a new one every 5 seconds.',
};

export default function Page() {
  return <JokesView />;
}
