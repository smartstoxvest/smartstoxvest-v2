import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Post = {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  image_url?: string | null;          // fallback from legacy field
  published_at?: string | null;       // ISO date
  author?: string | null;
};

type LatestInsightsProps = {
  limit?: number;           // default 3
  className?: string;       // optional extra styles
};

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function LatestInsights({ limit = 3, className = "" }: LatestInsightsProps) {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`${API_BASE}/api/posts/recent?limit=${limit}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Post[] = await res.json();
        if (alive) setPosts(data);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load posts");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [limit]);

  return (
    <section className={`mx-auto max-w-6xl px-4 md:px-6 ${className}`}>
      <header className="mb-6 md:mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Latest Insights on Smart Investing
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-600">
          Fresh research drops from our short-, medium-, and long-term models.
        </p>
      </header>

      {loading && <SkeletonGrid />}

      {!loading && err && (
        <div className="rounded-xl bg-red-50 text-red-700 p-4 text-sm">
          Couldn’t fetch posts: {err}
        </div>
      )}

      {!loading && !err && (!posts || posts.length === 0) && (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-600">
          No posts yet. Come back soon—alpha is marinating.
        </div>
      )}

      {!loading && !err && posts && posts.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => {
            const cover = p.cover_image_url || p.image_url || undefined;
            return (
              <article
                key={p.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 hover:shadow-md transition"
              >
                {cover ? (
                  <Link to={`/blog/${p.slug}`} className="block aspect-[16/9] overflow-hidden">
                    <img
                      src={cover}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                ) : null}

                <div className="p-4 md:p-5">
                  <Link to={`/blog/${p.slug}`}>
                    <h3 className="text-lg font-semibold leading-snug line-clamp-2">
                      {p.title}
                    </h3>
                  </Link>
                  <div className="mt-2 text-xs text-gray-500">
                    {p.published_at ? formatDate(p.published_at) : ""}
                    {p.author ? ` · ${p.author}` : ""}
                  </div>
                  <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                    {p.excerpt || "Tap to read the full breakdown."}
                  </p>
                  <Link
                    to={`/blog/${p.slug}`}
                    className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    aria-label={`Read ${p.title}`}
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100">
          <div className="h-40 bg-gray-200" />
          <div className="p-4 md:p-5 space-y-3">
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-1/3 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
