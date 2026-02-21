import { NavLink } from '@components/NavLink';
import { NavBadge } from '@components/NavBadge';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-divider bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
        {/* Brand */}
        <div className="flex items-center gap-2 text-sm font-semibold text-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 text-primary"
          >
            <path
              fillRule="evenodd"
              d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
              clipRule="evenodd"
            />
          </svg>
          Chuck Norris Client
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <NavLink href="/" label="Jokes" />
          <NavLink href="/favorites" label="Favorieten" badge={<NavBadge />} />
        </nav>
      </div>
    </header>
  );
}
