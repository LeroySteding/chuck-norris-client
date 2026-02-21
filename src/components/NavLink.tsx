'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({
  href,
  label,
  badge,
}: {
  href: string;
  label: string;
  badge?: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        'flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        active ? 'bg-primary text-white' : 'text-muted hover:bg-surface-2 hover:text-content',
      ].join(' ')}
    >
      {label}
      {badge}
    </Link>
  );
}
