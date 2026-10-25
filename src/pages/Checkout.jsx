import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AddressForm from "../components/AddressForm";
import PaymentSelector from "../components/PaymentSelector";
import { placeOrder } from "../features/checkout/checkoutSlice";
import { selectCartItems, selectCartTotal, clearCart } from "../features/cart/cartSlice";
import { formatINR } from "../utils/currency";
import { isPhone, isPincode, isUPI, isCardNumber, isExpiry, isCVV } from "../utils/validators";

const EMPTY_ADDRESS = {
  name: "", phone: "", pincode: "", line1: "", line2: "",
  city: "", state: "", lat: null, lng: null,
};
const EMPTY_PAY = { upiId: "", cardNumber: "", cardName: "", expiry: "", cvv: "" };

function validate(address, method, pay) {
  const e = {};
  if (!address.name.trim()) e.name = "Enter your full name";
  if (!isPhone(address.phone)) e.phone = "Enter a valid 10-digit mobile number";
  if (!address.line1.trim()) e.line1 = "Enter your address";
  if (!address.city.trim()) e.city = "Enter your city";
  if (!address.state.trim()) e.state = "Enter your state";
  if (!isPincode(address.pincode)) e.pincode = "Enter a valid 6-digit PIN code";

  if (method === "upi" && !isUPI(pay.upiId.trim())) e.upiId = "Enter a valid UPI ID, e.g. name@bank";
  if (method === "card") {
    if (!isCardNumber(pay.cardNumber)) e.cardNumber = "Enter a valid card number";
    if (!pay.cardName.trim()) e.cardName = "Enter the name on the card";
    if (!isExpiry(pay.expiry)) e.expiry = "Enter a valid, future expiry (MM/YY)";
    if (!isCVV(pay.cvv)) e.cvv = "Enter a valid CVV";
  }
  return e;
}

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [method, setMethod] = useState("upi");
  const [pay, setPay] = useState(EMPTY_PAY);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  // Nothing in the cart, send the user back to the cart page.
  // (`placing` stops this redirect firing right after we clear the cart.)
  if (items.length === 0 && !placing) return <Navigate to="/cart" replace />;

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(address, method, pay);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setPlacing(true);
    // Simulated payment processing (no real money moves)
    setTimeout(() => {
      const paymentLabel =
        method === "upi"
          ? `UPI (${pay.upiId.trim()})`
          : method === "card"
          ? `Card ending ${pay.cardNumber.replace(/\s/g, "").slice(-4)}`
          : "Cash on Delivery";

      dispatch(
        placeOrder({
          id: `BZR-${Date.now().toString().slice(-8)}`,
          items, // copy of the cart at the time of ordering
          address,
          payment: paymentLabel, // never the full card number or CVV
          total,
          placedAt: new Date().toISOString(),
        })
      );
      dispatch(clearCart());
      navigate("/order-success");
    }, 1200);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl text-ink">Checkout</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-8 md:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="mb-4 font-display text-lg text-ink">1. Delivery address</h2>
            <AddressForm address={address} setAddress={setAddress} errors={errors} />
          </section>

          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="mb-4 font-display text-lg text-ink">2. Payment method</h2>
            <PaymentSelector method={method} setMethod={setMethod} details={pay} setDetails={setPay} errors={errors} />
          </section>
        </div>

        {/* Order summary */}
        <aside className="h-fit rounded-lg border border-line bg-white p-5 shadow-card md:sticky md:top-24">
          <h2 className="font-display text-lg text-ink">Order summary</h2>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <img src={item.thumbnail} alt="" className="h-14 w-14 shrink-0 rounded-md border border-line object-contain p-1" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm text-ink">{item.title}</p>
                  <p className="text-xs text-subink">Qty {item.qty} · {formatINR(item.price * item.qty)}</p>
                </div>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-subink">Subtotal</dt><dd>{formatINR(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-subink">Delivery</dt><dd className="text-teal">Free</dd></div>
            <div className="flex justify-between border-t border-line pt-2 font-semibold text-ink"><dt>Total</dt><dd>{formatINR(total)}</dd></div>
          </dl>
          <button
            type="submit"
            disabled={placing}
            className="mt-5 w-full rounded-md bg-marigold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-marigold-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-subink"
          >
            {placing ? "Processing payment…" : method === "cod" ? "Place order" : `Pay ${formatINR(total)}`}
          </button>
          <Link to="/cart" className="mt-3 block text-center text-xs text-subink hover:text-ink hover:underline">
            Back to cart
          </Link>
        </aside>
      </form>
    </main>
  );
}