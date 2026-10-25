import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  increaseQty,
  decreaseQty,
  removeItem,
  clearCart,
} from "../features/cart/cartSlice";
import { formatINR } from "../utils/currency";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl text-ink">Your cart is empty</h1>
        <p className="mt-2 text-sm text-subink">Add some products and they will show up here.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-marigold px-6 py-3 text-sm font-semibold text-ink hover:bg-marigold-dark"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl text-ink">
          Your cart <span className="text-base text-subink">({count} {count === 1 ? "item" : "items"})</span>
        </h1>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-sm text-subink hover:text-sale hover:underline"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_340px]">
        {/* Items */}
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 rounded-lg border border-line bg-white p-4">
              <Link to={`/product/${item.id}`} className="shrink-0">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-24 w-24 rounded-md border border-line object-contain p-1"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  to={`/product/${item.id}`}
                  className="line-clamp-2 text-sm text-ink hover:underline"
                >
                  {item.title}
                </Link>
                <p className="mt-1 text-sm text-subink">{formatINR(item.price)} each</p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <div className="flex items-center rounded-md border border-line">
                    <button
                      onClick={() => dispatch(decreaseQty(item.id))}
                      disabled={item.qty <= 1}
                      className="px-3 py-1 text-lg text-ink hover:bg-paper disabled:cursor-not-allowed disabled:text-subink/40"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-medium">{item.qty}</span>
                    <button
                      onClick={() => dispatch(increaseQty(item.id))}
                      disabled={item.qty >= item.stock}
                      className="px-3 py-1 text-lg text-ink hover:bg-paper disabled:cursor-not-allowed disabled:text-subink/40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-display text-lg text-ink">{formatINR(item.price * item.qty)}</p>

                  <button
                    onClick={() => dispatch(removeItem(item.id))}
                    className="text-sm text-sale hover:underline"
                  >
                    Remove
                  </button>
                </div>
                {item.qty >= item.stock && (
                  <p className="mt-1 text-xs text-marigold-dark">Maximum available quantity reached</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="h-fit rounded-lg border border-line bg-white p-5 shadow-card md:sticky md:top-24">
          <h2 className="font-display text-lg text-ink">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-subink">Subtotal ({count} {count === 1 ? "item" : "items"})</dt>
              <dd>{formatINR(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-subink">Delivery</dt>
              <dd className="text-teal">Free</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 font-semibold text-ink">
              <dt>Total</dt>
              <dd>{formatINR(total)}</dd>
            </div>
          </dl>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-5 w-full rounded-md bg-marigold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-marigold-dark"
          >
            Proceed to checkout
          </button>
          <Link to="/" className="mt-3 block text-center text-xs text-subink hover:text-ink hover:underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}