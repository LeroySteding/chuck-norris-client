'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        'rounded-md px-3 py-2 text-sm font-medium transition',
        active ? 'bg-black/10' : 'hover:bg-black/5',
      ].join(' ')}
    >
      {label}
    </Link>
  );
}
