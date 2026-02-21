import { NavLink } from '@components/NavLink';

export function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-3xl items-center justify-between p-6">
        <div className="text-base font-semibold">Chuck Norris Client</div>

        <nav className="flex items-center gap-2">
          <NavLink href="/" label="Jokes" />
          <NavLink href="/favorites" label="Favorieten" />
        </nav>
      </div>
    </header>
  );
}
