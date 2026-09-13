import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductById } from "../api/productService";
import { DetailSkeleton } from "../components/Loader";
import ErrorState from "../components/ErrorState";
import StarRating from "../components/StarRating";
import { formatINR } from "../utils/currency";

const MOCK_VARIANTS = {
  Color: ["Midnight Black", "Pearl White", "Ocean Blue"],
  Storage: ["128 GB", "256 GB", "512 GB"],
};

function stockLabel(stock) {
  if (stock === 0) return { text: "Out of stock", tone: "text-sale" };
  if (stock <= 10) return { text: `Only ${stock} left`, tone: "text-marigold-dark" };
  return { text: "In stock", tone: "text-teal" };
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState({ Color: 0, Storage: 0 });

  const load = useCallback(() => {
    setStatus("loading");
    setError(null);
    fetchProductById(id)
      .then((data) => {
        setProduct(data);
        setActiveImage(0);
        setStatus("succeeded");
      })
      .catch((err) => {
        setError(err.message ?? "Failed to load this product");
        setStatus("failed");
      });
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <DetailSkeleton />
      </main>
    );
  }

  if (status === "failed") {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <ErrorState title="Couldn't load this product" message={error} onRetry={load} />
      </main>
    );
  }

  const stock = stockLabel(product.stock);
  const images = product.images?.length ? product.images : [product.thumbnail];
  const hasDiscount = product.discountPercentage > 0;
  const strikePrice = hasDiscount
    ? formatINR(product.price / (1 - product.discountPercentage / 100))
    : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="mb-6 text-sm text-subink">
        <Link to="/" className="hover:text-ink hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          to={`/?category=${product.category}`}
          className="capitalize hover:text-ink hover:underline"
        >
          {product.category?.replace(/-/g, " ")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="mb-3 aspect-square overflow-hidden rounded-lg border border-line bg-white">
            <img
              src={images[activeImage]}
              alt={product.title}
              className="h-full w-full object-contain p-6"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-white ${
                  i === activeImage ? "border-marigold" : "border-line"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-contain p-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-subink">
            {product.brand}
          </p>
          <h1 className="mt-1 font-display text-2xl text-ink">{product.title}</h1>

          <div className="mt-2">
            <StarRating rating={product.rating} size="lg" count={product.reviews?.length} />
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl text-ink">{formatINR(product.price)}</span>
            {strikePrice && (
              <>
                <span className="text-subink line-through">{strikePrice}</span>
                <span className="rounded bg-sale/10 px-2 py-0.5 text-sm font-medium text-sale">
                  {Math.round(product.discountPercentage)}% off
                </span>
              </>
            )}
          </div>

          <p className={`mt-2 text-sm font-medium ${stock.tone}`}>{stock.text}</p>

          <p className="mt-4 text-sm leading-relaxed text-subink">{product.description}</p>

          {/* Mock variants — illustrative only; DummyJSON has no real variant data */}
          <div className="mt-6 space-y-4">
            {Object.entries(MOCK_VARIANTS).map(([label, options]) => (
              <div key={label}>
                <p className="mb-2 text-sm font-semibold text-ink">{label}</p>
                <div className="flex flex-wrap gap-2">
                  {options.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => setVariant((v) => ({ ...v, [label]: i }))}
                      className={`rounded-md border px-3 py-1.5 text-sm ${
                        variant[label] === i
                          ? "border-ink bg-ink text-paper"
                          : "border-line text-ink hover:border-ink"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            disabled={product.stock === 0}
            className="mt-8 w-full rounded-md bg-marigold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-marigold-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-subink sm:w-auto"
            title="Cart logic ships in Evaluation 2"
          >
            {product.stock === 0 ? "Out of stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-14 border-t border-line pt-8">
        <h2 className="font-display text-xl">Reviews</h2>
        {!product.reviews?.length && (
          <p className="mt-2 text-sm text-subink">No reviews yet for this product.</p>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {product.reviews?.map((r, i) => (
            <div key={i} className="rounded-lg border border-line bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">{r.reviewerName}</p>
                <StarRating rating={r.rating} />
              </div>
              <p className="mt-2 text-sm text-subink">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
