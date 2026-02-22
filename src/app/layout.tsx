import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: {
    template: '%s | Chuck Norris',
    default: 'Chuck Norris Client',
  },
  description: 'Random Chuck Norris jokes + favorites',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
