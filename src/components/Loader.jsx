export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-line bg-white p-3 shadow-card"
        >
          <div className="mb-3 aspect-square w-full rounded-md bg-line/70" />
          <div className="mb-2 h-3 w-3/4 rounded bg-line/70" />
          <div className="mb-2 h-3 w-1/2 rounded bg-line/70" />
          <div className="h-4 w-1/3 rounded bg-line/70" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-10 md:grid-cols-2">
      <div className="aspect-square w-full rounded-lg bg-line/70" />
      <div className="space-y-4">
        <div className="h-5 w-2/3 rounded bg-line/70" />
        <div className="h-4 w-1/3 rounded bg-line/70" />
        <div className="h-8 w-1/4 rounded bg-line/70" />
        <div className="h-24 w-full rounded bg-line/70" />
      </div>
    </div>
  );
}
