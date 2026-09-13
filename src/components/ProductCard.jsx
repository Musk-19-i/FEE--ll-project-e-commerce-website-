import { Link } from "react-router-dom";
import { memo } from "react";
import StarRating from "./StarRating";
import { formatINR } from "../utils/currency";

function ProductCard({ product }) {
  const hasDiscount = product.discountPercentage > 0;
  const strikePrice = hasDiscount
    ? formatINR(product.price / (1 - product.discountPercentage / 100))
    : null;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col rounded-lg border border-line bg-white p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-paper">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain p-3 transition group-hover:scale-105"
        />
        {product.stock === 0 && (
          <span className="absolute left-2 top-2 rounded bg-ink/85 px-2 py-0.5 text-[11px] font-medium text-paper">
            Out of stock
          </span>
        )}
        {hasDiscount && product.stock > 0 && (
          <span className="absolute left-2 top-2 rounded bg-sale px-2 py-0.5 text-[11px] font-medium text-white">
            {Math.round(product.discountPercentage)}% off
          </span>
        )}
      </div>

      <p className="line-clamp-2 text-sm text-ink">{product.title}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-subink">{product.brand}</p>

      <div className="mt-2">
        <StarRating rating={product.rating} />
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-lg text-ink">{formatINR(product.price)}</span>
        {strikePrice && (
          <span className="text-xs text-subink line-through">{strikePrice}</span>
        )}
      </div>
    </Link>
  );
}

// Cards re-render often as filters change the surrounding list; memo keeps
// unaffected cards from re-rendering when sibling cards' props haven't changed.
export default memo(ProductCard);
