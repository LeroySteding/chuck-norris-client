type StatusPillProps = {
  status: 'running' | 'paused';
};

export function StatusPill({ status }: StatusPillProps) {
  if (status === 'running') {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        Running
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-faint" />
      Paused
    </span>
  );
}
