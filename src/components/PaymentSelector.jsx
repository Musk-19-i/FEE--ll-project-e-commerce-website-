import FormField, { inputCls } from "./FormField";

const METHODS = [
  { key: "upi", label: "UPI", hint: "Google Pay, PhonePe, Paytm…" },
  { key: "card", label: "Credit / Debit card", hint: "Visa, Mastercard, RuPay" },
  { key: "cod", label: "Cash on Delivery", hint: "Pay when your order arrives" },
];

export default function PaymentSelector({ method, setMethod, details, setDetails, errors }) {
  const set = (field, format = (v) => v) => (e) =>
    setDetails((d) => ({ ...d, [field]: format(e.target.value) }));

  const fmtCard = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };
  const fmtDigits = (v) => v.replace(/\D/g, "").slice(0, 4);

  return (
    <div>
      <div className="space-y-2">
        {METHODS.map((m) => (
          <label
            key={m.key}
            className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${
              method === m.key ? "border-ink bg-white" : "border-line hover:border-ink"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={m.key}
              checked={method === m.key}
              onChange={() => setMethod(m.key)}
              className="accent-teal"
            />
            <span>
              <span className="block text-sm font-medium text-ink">{m.label}</span>
              <span className="block text-xs text-subink">{m.hint}</span>
            </span>
          </label>
        ))}
      </div>

      {method === "upi" && (
        <div className="mt-4">
          <FormField label="UPI ID" error={errors.upiId}>
            <input className={inputCls(errors.upiId)} placeholder="name@bank" value={details.upiId} onChange={set("upiId")} />
          </FormField>
        </div>
      )}

      {method === "card" && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Card number" error={errors.cardNumber} className="sm:col-span-2">
            <input className={inputCls(errors.cardNumber)} placeholder="1234 5678 9012 3456" inputMode="numeric" autoComplete="cc-number" value={details.cardNumber} onChange={set("cardNumber", fmtCard)} />
          </FormField>
          <FormField label="Name on card" error={errors.cardName} className="sm:col-span-2">
            <input className={inputCls(errors.cardName)} autoComplete="cc-name" value={details.cardName} onChange={set("cardName")} />
          </FormField>
          <FormField label="Expiry (MM/YY)" error={errors.expiry}>
            <input className={inputCls(errors.expiry)} placeholder="08/29" inputMode="numeric" autoComplete="cc-exp" value={details.expiry} onChange={set("expiry", fmtExpiry)} />
          </FormField>
          <FormField label="CVV" error={errors.cvv}>
            <input className={inputCls(errors.cvv)} type="password" inputMode="numeric" autoComplete="cc-csc" value={details.cvv} onChange={set("cvv", fmtDigits)} />
          </FormField>
        </div>
      )}

      {method === "cod" && (
        <p className="mt-4 rounded-md bg-marigold-light px-3 py-2 text-sm text-ink">
          Keep the exact amount ready at delivery.
        </p>
      )}
    </div>
  );
}