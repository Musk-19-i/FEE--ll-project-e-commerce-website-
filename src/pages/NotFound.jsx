import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-3xl text-ink">Page not found</h1>
      <p className="mt-2 text-subink">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
      >
        Back to shopping
      </Link>
    </main>
  );
}
