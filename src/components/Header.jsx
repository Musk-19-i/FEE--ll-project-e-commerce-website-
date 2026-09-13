import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../features/products/productsSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useSelector((state) => state.products.filters.query);

  function handleSearch(e) {
    e.preventDefault();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0 ">
        <img src="/logo.png" alt="Bazaar" className="h-8 w-auto sm:h-9" />
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 sm:block">
          <input
            type="search"
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            placeholder="Search products…"
            className="w-full rounded-md border border-transparent bg-white/95 px-4 py-2 text-sm text-ink placeholder:text-subink focus:border-marigold focus:outline-none"
            aria-label="Search products"
          />
        </form>

        <div className="ml-auto flex items-center gap-4 text-sm">
          
          <div
            className="flex items-center gap-2 rounded-md border border-paper/20 px-3 py-1.5"
            aria-label="Cart placeholder, 0 items"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>
            <span className="font-medium">0</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="px-4 pb-3 sm:hidden">
        <input
          type="search"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          placeholder="Search products…"
          className="w-full rounded-md border border-transparent bg-white/95 px-4 py-2 text-sm text-ink placeholder:text-subink focus:border-marigold focus:outline-none"
          aria-label="Search products"
        />
      </form>
    </header>
  );
}
