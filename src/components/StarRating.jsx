function Star({ fill }) {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
      <defs>
        <linearGradient id={`grad-${fill}`}>
          <stop offset={`${fill * 100}%`} stopColor="#D98A00" />
          <stop offset={`${fill * 100}%`} stopColor="#E4DECF" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#grad-${fill})`}
        d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.61.99-5.79-4.21-4.1 5.82-.85z"
      />
    </svg>
  );
}

export default function StarRating({ rating = 0, count, size = "sm" }) {
  const stars = [0, 1, 2, 3, 4].map((i) => {
    const fill = Math.max(0, Math.min(1, rating - i));
    return <Star key={i} fill={fill} />;
  });
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">{stars}</div>
      <span className={size === "lg" ? "text-sm text-subink" : "text-xs text-subink"}>
        {rating.toFixed(1)}
        {count != null ? ` (${count})` : ""}
      </span>
    </div>
  );
}
