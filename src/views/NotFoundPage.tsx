import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-mono text-paper px-6 text-center">
      <Head>
        <title>404 — page not found</title>
        <meta name="robots" content="noindex" />
      </Head>
      <p className="text-[10rem] leading-none font-departure text-accent-red select-none">
        404
      </p>
      <h1 className="mt-4 text-xl">this page wandered off the desk</h1>
      <p className="mt-2 text-sm opacity-60">
        the route you followed doesn't exist (or never did).
      </p>
      <Link
        to="/"
        className="mt-8 border border-paper/40 px-5 py-2 text-sm hover:bg-paper hover:text-ink transition-colors"
      >
        ← back home
      </Link>
    </div>
  );
}
