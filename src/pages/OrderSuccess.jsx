import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { formatINR } from "../utils/currency";

export default function OrderSuccess() {
  const order = useSelector((s) => s.checkout.lastOrder);
  if (!order) return <Navigate to="/" replace />;

  const { address } = order;
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="rounded-lg border border-line bg-white p-6 text-center shadow-card">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-light text-teal">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display text-2xl text-ink">Order placed!</h1>
        <p className="mt-1 text-sm text-subink">Order ID: {order.id}</p>
      </div>

      <div className="mt-6 space-y-4 rounded-lg border border-line bg-white p-6 text-sm">
        <div>
          <p className="mb-2 font-semibold text-ink">Items</p>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <img src={item.thumbnail} alt="" className="h-12 w-12 shrink-0 rounded-md border border-line object-contain p-1" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-ink">{item.title}</p>
                  <p className="text-xs text-subink">Qty {item.qty}</p>
                </div>
                <p className="text-ink">{formatINR(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t border-line pt-3 font-semibold text-ink">
            <span>Total</span>
            <span>{formatINR(order.total)}</span>
          </p>
        </div>

        <div className="border-t border-line pt-4">
          <p className="font-semibold text-ink">Delivering to</p>
          <p className="text-subink">
            {address.name}, {address.phone}<br />
            {address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />
            {address.city}, {address.state} {address.pincode}
          </p>
        </div>

        <div className="border-t border-line pt-4">
          <p className="font-semibold text-ink">Payment</p>
          <p className="text-subink">{order.payment}</p>
        </div>
      </div>

      <Link to="/" className="mt-6 inline-block rounded-md bg-marigold px-6 py-3 text-sm font-semibold text-ink hover:bg-marigold-dark">
        Continue shopping
      </Link>
    </main>
  );
}