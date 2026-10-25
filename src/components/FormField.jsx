export const inputCls = (hasError) =>
  `w-full rounded-md border bg-white px-3 py-2 text-sm text-ink placeholder:text-subink focus:border-marigold focus:outline-none ${
    hasError ? "border-sale" : "border-line"
  }`;

export default function FormField({ label, error, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-sale">{error}</span>}
    </label>
  );
}