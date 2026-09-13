export default function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-line bg-white px-6 py-14 text-center">
      <p className="font-display text-lg text-ink">{title}</p>
      {message && <p className="max-w-md text-sm text-subink">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/90"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyResults({ onReset }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line bg-white/60 px-6 py-16 text-center">
      <p className="font-display text-lg text-ink">No products match these filters</p>
      <p className="max-w-sm text-sm text-subink">
        Try widening the price range, clearing a brand, or resetting filters.
      </p>
      <button
        onClick={onReset}
        className="mt-2 rounded-md border border-ink px-4 py-2 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
      >
        Reset filters
      </button>
    </div>
  );
}
