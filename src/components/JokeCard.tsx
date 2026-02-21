'use client';

import Image from 'next/image';
import type { JokeItem } from '@/lib/types';
import { useFavorites } from '@/store/FavoritesProvider';
import { useToast } from '@/store/ToastProvider';
import { StarButton } from '@/components/StarButton';

/* ── Category badge ───────────────────────────────────────────── */

const categoryStyle: Record<string, { bg: string; text: string }> = {
  dev: { bg: 'bg-info-soft', text: 'text-info' },
  sport: { bg: 'bg-success-soft', text: 'text-success' },
  animal: { bg: 'bg-danger-soft', text: 'text-danger' },
  celebrity: { bg: 'bg-surface-2', text: 'text-muted' },
  nerdy: { bg: 'bg-primary-soft', text: 'text-primary' },
};

function CategoryBadge({ category }: { category: string }) {
  const style = categoryStyle[category] ?? { bg: 'bg-surface-2', text: 'text-muted' };
  return (
    <span
      className={`rounded-[6px] px-2 py-0.5 text-[11px] font-semibold ${style.bg} ${style.text}`}
    >
      {category}
    </span>
  );
}

/* ── Avatar ───────────────────────────────────────────────────── */

function JokeAvatar({ iconUrl }: { iconUrl: string }) {
  return (
    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary-soft">
      <Image
        src={iconUrl}
        alt="Chuck Norris"
        width={40}
        height={40}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/* ── Clock icon ───────────────────────────────────────────────── */

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="h-3 w-3"
    >
      <path
        fillRule="evenodd"
        d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8zm7-4.75a.75.75 0 0 1 .75.75v3.69l2.28 1.37a.75.75 0 0 1-.77 1.28L7.5 8.68V4a.75.75 0 0 1 .5-.75z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ── Card ─────────────────────────────────────────────────────── */

type JokeCardProps = {
  item: JokeItem;
  showFetchedAt?: boolean;
  actions?: React.ReactNode;
};

export function JokeCard({ item, showFetchedAt = true, actions }: JokeCardProps) {
  const { isFavorite, toggle } = useFavorites();
  const { showToast } = useToast();

  const fav = isFavorite(item.joke.id);
  const categories = item.joke.categories ?? [];
  const shortId = item.joke.id.slice(0, 8) + '…';

  return (
    <li className="overflow-hidden rounded-[14px] border border-divider bg-surface">
      {/* Top row: avatar | joke text | action */}
      <div className="flex items-start gap-3 p-4">
        <JokeAvatar iconUrl={item.joke.icon_url} />

        <p className="flex-1 text-[15px] leading-relaxed text-content">{item.joke.value}</p>

        {actions ?? (
          <StarButton
            active={fav}
            onClick={() => {
              const res = toggle(item.joke);
              if (res.blockedByLimit) showToast('Maximaal 10 favorieten toegestaan.');
            }}
          />
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-divider" />

      {/* Bottom row: [category + ID] ── [clock + time] */}
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left meta */}
        <div className="flex items-center gap-2">
          {categories.length > 0
            ? categories.map((cat) => <CategoryBadge key={cat} category={cat} />)
            : null}
          <span className="text-[11px] text-muted">{shortId}</span>
        </div>

        {/* Right meta */}
        {showFetchedAt && item.fetchedAt != null && (
          <div className="flex items-center gap-1 text-muted">
            <ClockIcon />
            <span className="text-[11px]">{new Date(item.fetchedAt).toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </li>
  );
}
