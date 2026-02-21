export function SkeletonCard() {
  return (
    <li className="animate-pulse rounded-xl border border-divider bg-surface p-4">
      <div className="flex items-start gap-3">
        {/* Avatar placeholder */}
        <div className="h-9 w-9 shrink-0 rounded-full bg-surface-2" />

        {/* Text lines */}
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 rounded-full bg-surface-2" />
          <div className="h-3.5 w-4/5 rounded-full bg-surface-2" />
          <div className="h-3.5 w-3/5 rounded-full bg-surface-2" />
        </div>

        {/* Star placeholder */}
        <div className="h-8 w-8 shrink-0 rounded-lg bg-surface-2" />
      </div>

      {/* Bottom row placeholder */}
      <div className="mt-3 pl-12">
        <div className="h-3 w-1/4 rounded-full bg-surface-2" />
      </div>
    </li>
  );
}
