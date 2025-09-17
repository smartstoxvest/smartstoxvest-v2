import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// ⚙️ Align with backend payload
type BlogPostCard = {
  id: number;
  title: string;
  slug: string;
  tags: string;
  author?: string | null;
  // New fields
  excerpt?: string | null;
  cover_image_url?: string | null;
  image_url?: string | null; // legacy fallback
  published_at?: string | null;
  created_at?: string | null; // still present in DB
};

type Status = "loading" | "success" | "empty" | "error";

export default function BlogPublic() {
  const [posts, setPosts] = useState<BlogPostCard[] | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [err, setErr] = useState<string | null>(null);
  const mounted = useRef(true);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function fetchUntilReady({
    maxErrorRetries = 3,
    maxEmptyRetries = 2,
    minLoadingMs = 700,
  } = {}) {
    const start = performance.now();
    let lastErr: unknown = null;

    // Warm backend (ignore errors)
    fetch(`${API_URL}/healthz`).catch(() => {});

    for (let i = 0; i < maxErrorRetries; i++) {
      try {
        const url = `${API_URL}/api/posts?published_only=true&_=${Date.now()}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BlogPostCard[] = await res.json();

        // Empty retries
        if (!data || data.length === 0) {
          for (let j = 0; j < maxEmptyRetries; j++) {
            await sleep(500 * (j + 1));
            const res2 = await fetch(url, { cache: "no-store" });
            if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
            const data2: BlogPostCard[] = await res2.json();
            if (data2 && data2.length > 0) {
              const elapsed = performance.now() - start;
              if (elapsed < minLoadingMs) await sleep(minLoadingMs - elapsed);
              if (!mounted.current) return;
              setPosts(data2);
              setStatus("success");
              return;
            }
          }
          const elapsed = performance.now() - start;
          if (elapsed < minLoadingMs) await sleep(minLoadingMs - elapsed);
          if (!mounted.current) return;
          setPosts([]);
          setStatus("empty");
          return;
        }

        // Success
        const elapsed = performance.now() - start;
        if (elapsed < minLoadingMs) await sleep(minLoadingMs - elapsed);
        if (!mounted.current) return;
        setPosts(data);
        setStatus("success");
        return;
      } catch (e) {
        lastErr = e;
        await sleep(600 * Math.pow(2, i)); // 0.6s, 1.2s, 2.4s
      }
    }

    if (!mounted.current) return;
    setErr(String(lastErr));
    setStatus("error");
  }

  useEffect(() => {
    fetchUntilReady();
    return () => {
      mounted.current = false;
    };
  }, []);

  // ---- RENDER STATES ----
  if (status === "loading" || posts === null) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-6">SmartStoxVest Blog</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-96 bg-gray-200 rounded" />
          <div className="h-48 w-full bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-red-600 font-medium">Couldn’t load posts.</p>
        <button
          onClick={() => fetchUntilReady()}
          className="mt-3 px-4 py-2 rounded bg-blue-600 text-white"
        >
          Retry
        </button>
        {err && <p className="mt-2 text-xs text-gray-500">{err}</p>}
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center text-gray-700">
        <h1 className="text-3xl font-bold mb-4">SmartStoxVest Blog</h1>
        No posts yet.
      </div>
    );
  }

  // ---- SUCCESS ----
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">SmartStoxVest Blog</h1>

      {posts.map((post) => {
        const cover = post.cover_image_url || post.image_url || undefined;
        const dateISO = post.published_at || post.created_at || "";
        const prettyDate = dateISO
          ? new Date(dateISO).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "";

        return (
          <article key={post.id} className="mb-10 border-b pb-6">
            <h2 className="text-xl font-semibold mb-1">
              <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                {post.title}
              </Link>
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              {prettyDate}
              {post.tags &&
                " • " +
                  post.tags
                    .split(",")
                    .map((t) => `#${t.trim()}`)
                    .join(" ")}
            </p>

            {cover && (
              <Link to={`/blog/${post.slug}`}>
                <img
                  src={cover}
                  alt={post.title}
                  className="my-3 rounded-md shadow-md max-w-md"
                  loading="lazy"
                />
              </Link>
            )}

            {/* Use excerpt for speed + UX */}
            <p className="text-sm text-gray-700">
              {(post.excerpt && post.excerpt.trim()) || "Tap to read the full post."}
            </p>

            <Link
              to={`/blog/${post.slug}`}
              className="mt-3 inline-block text-blue-600 hover:underline text-sm"
            >
              👉 Read Full Post
            </Link>
          </article>
        );
      })}
    </div>
  );
}
