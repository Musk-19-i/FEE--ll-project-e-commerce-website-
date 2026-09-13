import { useSelector, useDispatch } from "react-redux";
import { useCallback, useState, useEffect } from "react";
import {
  setCategory,
  toggleBrand,
  setPriceRange,
  setMinRating,
  resetFilters,
} from "../features/products/productsSlice";
import {
  selectCategories,
  selectAllBrands,
  selectPriceBounds,
} from "../features/products/productsSelectors";
import StarRating from "./StarRating";
import { toINR, fromINR } from "../utils/currency";

function formatLabel(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FilterSidebar() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const brands = useSelector(selectAllBrands);
  const bounds = useSelector(selectPriceBounds);
  const filters = useSelector((state) => state.products.filters);

  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");

  
  useEffect(() => {
    if (bounds.max > 0 && minInput === "" && maxInput === "") {
      setMinInput(String(Math.round(toINR(bounds.min))));
      setMaxInput(String(Math.round(toINR(bounds.max))));
    }
    
  }, [bounds.max]);

  const applyPriceRange = useCallback(() => {
    
    const min = minInput === "" ? null : fromINR(Number(minInput));
    const max = maxInput === "" ? null : fromINR(Number(maxInput));
    dispatch(setPriceRange({ min, max }));
  }, [dispatch, minInput, maxInput]);

  return (
    <aside className="w-full shrink-0 space-y-6 md:w-64">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg">Filters</h2>
        <button
          onClick={() => {
            dispatch(resetFilters());
            setMinInput(String(Math.round(toINR(bounds.min))));
            setMaxInput(String(Math.round(toINR(bounds.max))));
          }}
          className="text-xs font-medium text-teal underline-offset-2 hover:underline"
        >
          Reset all
        </button>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => dispatch(setCategory("all"))}
            className={`block w-full rounded px-2 py-1 text-left text-sm capitalize ${
              filters.category === "all"
                ? "bg-marigold-light text-marigold-dark"
                : "text-subink hover:bg-line/40"
            }`}
          >
            All categories
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => dispatch(setCategory(c))}
              className={`block w-full rounded px-2 py-1 text-left text-sm capitalize ${
                filters.category === c
                  ? "bg-marigold-light text-marigold-dark"
                  : "text-subink hover:bg-line/40"
              }`}
            >
              {formatLabel(c)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Price (₹)</h3>
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-sm text-subink">
              ₹
            </span>
            <input
              type="number"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              onBlur={applyPriceRange}
              className="w-full rounded border border-line py-1 pl-5 pr-2 text-sm"
              aria-label="Minimum price in rupees"
            />
          </div>
          <span className="text-subink">–</span>
          <div className="relative w-full">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-sm text-subink">
              ₹
            </span>
            <input
              type="number"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              onBlur={applyPriceRange}
              className="w-full rounded border border-line py-1 pl-5 pr-2 text-sm"
              aria-label="Maximum price in rupees"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Rating</h3>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => dispatch(setMinRating(filters.minRating === r ? 0 : r))}
              className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm ${
                filters.minRating === r ? "bg-marigold-light" : "hover:bg-line/40"
              }`}
            >
              <StarRating rating={r} />
              <span className="text-subink">& up</span>
            </button>
          ))}
        </div>
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-ink">Brand</h3>
          <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
            {brands.map((b) => (
              <label
                key={b}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-subink hover:bg-line/40"
              >
                <input
                  type="checkbox"
                  checked={filters.brands.includes(b)}
                  onChange={() => dispatch(toggleBrand(b))}
                  className="h-3.5 w-3.5 accent-teal"
                />
                {b}
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
