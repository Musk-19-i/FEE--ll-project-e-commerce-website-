import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { loadProducts, resetFilters, setCategory } from "../features/products/productsSlice";
import {
  selectPaginatedProducts,
  selectResultCount,
  selectStatus,
  selectError,
} from "../features/products/productsSelectors";
import FilterSidebar from "../components/FilterSidebar";
import SortDropdown from "../components/SortDropdown";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { ProductGridSkeleton } from "../components/Loader";
import ErrorState, { EmptyResults } from "../components/ErrorState";

export default function ProductListing() {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const products = useSelector(selectPaginatedProducts);
  const resultCount = useSelector(selectResultCount);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (status === "idle") dispatch(loadProducts());
  }, [status, dispatch]);

  // Lets a product-detail breadcrumb link (/?category=x) preselect a filter.
  useEffect(() => {
    const category = searchParams.get("category");
    if (category && status === "succeeded") dispatch(setCategory(category));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, status]);

  const retry = useCallback(() => dispatch(loadProducts()), [dispatch]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between md:hidden">
        <h1 className="font-display text-xl">All Products</h1>
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="rounded-md border border-line px-3 py-1.5 text-sm"
        >
          {filtersOpen ? "Hide filters" : "Filters"}
        </button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <div className={`${filtersOpen ? "block" : "hidden"} md:block`}>
          <FilterSidebar />
        </div>

        <section className="flex-1">
          <div className="mb-4 hidden items-center justify-between md:flex">
            <h1 className="font-display text-xl">All Products</h1>
            <SortDropdown />
          </div>
          <div className="mb-4 flex items-center justify-between md:hidden">
            <p className="text-sm text-subink">
              {status === "succeeded" ? `${resultCount} results` : ""}
            </p>
            <SortDropdown />
          </div>

          {status === "succeeded" && (
            <p className="mb-3 hidden text-sm text-subink md:block">
              {resultCount} result{resultCount !== 1 ? "s" : ""}
            </p>
          )}

          {status === "loading" && <ProductGridSkeleton />}

          {status === "failed" && (
            <ErrorState
              title="Couldn't load products"
              message={error}
              onRetry={retry}
            />
          )}

          {status === "succeeded" && resultCount === 0 && (
            <EmptyResults onReset={() => dispatch(resetFilters())} />
          )}

          {status === "succeeded" && resultCount > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <Pagination />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
