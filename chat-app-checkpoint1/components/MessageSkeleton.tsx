export function MessageSkeleton() {
  return (
    <div className="skeleton-row" role="status" aria-label="Assistant is responding">
      <div className="skeleton-avatar" />
      <div className="skeleton-lines">
        <div className="skeleton-line w-80" />
        <div className="skeleton-line w-60" />
        <div className="skeleton-line w-40" />
      </div>
    </div>
  );
}
