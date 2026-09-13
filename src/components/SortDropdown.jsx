import { useDispatch, useSelector } from "react-redux";
import { setSort } from "../features/products/productsSlice";

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Avg. Rating" },
  { value: "newest", label: "Newest Arrivals" },
];

export default function SortDropdown() {
  const dispatch = useDispatch();
  const sort = useSelector((state) => state.products.sort);

  return (
    <label className="flex items-center gap-2 text-sm text-subink">
      Sort by
      <select
        value={sort}
        onChange={(e) => dispatch(setSort(e.target.value))}
        className="rounded-md border border-line bg-white px-2 py-1.5 text-sm text-ink focus:border-marigold focus:outline-none"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
