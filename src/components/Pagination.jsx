import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../features/products/productsSlice";
import { selectPage, selectTotalPages } from "../features/products/productsSelectors";

export default function Pagination() {
  const dispatch = useDispatch();
  const page = useSelector(selectPage);
  const totalPages = useSelector(selectTotalPages);

  if (totalPages <= 1) return null;

  function go(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    dispatch(setPage(next));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className="rounded-md border border-line px-3 py-1.5 text-sm text-ink disabled:opacity-40"
      >
        Prev
      </button>

      {pageNumbers.map((n, i) => (
        <span key={n} className="flex items-center">
          {i > 0 && pageNumbers[i - 1] !== n - 1 && (
            <span className="px-1 text-subink">…</span>
          )}
          <button
            onClick={() => go(n)}
            aria-current={n === page ? "page" : undefined}
            className={`h-8 w-8 rounded-md text-sm ${
              n === page
                ? "bg-ink text-paper"
                : "border border-line text-ink hover:bg-line/40"
            }`}
          >
            {n}
          </button>
        </span>
      ))}

      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className="rounded-md border border-line px-3 py-1.5 text-sm text-ink disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
