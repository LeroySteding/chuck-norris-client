import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="mt-6 flex flex-col items-center rounded-xl border border-divider bg-surface px-6 py-14 text-center">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-divider bg-surface-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-faint"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </div>

      <h2 className="text-sm font-semibold text-content">Nog geen favorieten</h2>
      <p className="mt-1.5 max-w-xs text-sm text-muted">
        Ga naar Jokes en klik ☆ om je favoriete grappen op te slaan.
      </p>

      <Link
        href="/"
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Naar Jokes
      </Link>
    </div>
  );
}
