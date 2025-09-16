import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const API_URL = import.meta.env.VITE_API_URL;

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  tags: string;
  author: string;
  content: string;
  image_url?: string;
  created_at: string;
};
type Status = "loading" | "success" | "empty" | "error";

export default function BlogPublic() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [err, setErr] = useState<string | null>(null);
  const mounted = useRef(true);

  async function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function fetchUntilReady({
    maxErrorRetries = 3,
    maxEmptyRetries = 2,          // 👈 try again if [] comes back
    minLoadingMs = 700,           // 👈 avoid UI flicker
  } = {}) {
    const start = performance.now();
    let lastErr: unknown = null;

    // warm backend in parallel (ignore errors)
    fetch(`${API_URL}/healthz`).catch(() => {});

    // error retries
    for (let i = 0; i < maxErrorRetries; i++) {
      try {
        const res = await fetch(`${API_URL}/api/posts?_=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BlogPost[] = await res.json();

        // empty retries (fast backoff)
        if (data.length === 0) {
          for (let j = 0; j < maxEmptyRetries; j++) {
            await sleep(500 * (j + 1)); // 0.5s → 1.0s
            const res2 = await fetch(`${API_URL}/api/posts?_=${Date.now()}`, {
              cache: "no-store",
            });
            if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
            const data2: BlogPost[] = await res2.json();
            if (data2.length > 0) {
              const elapsed = performance.now() - start;
              if (elapsed < minLoadingMs) await sleep(minLoadingMs - elapsed);
              if (!mounted.current) return;
              setPosts(data2);
              setStatus("success");
              return;
            }
          }
          // still empty after retries → declare empty
          const elapsed = performance.now() - start;
          if (elapsed < minLoadingMs) await sleep(minLoadingMs - elapsed);
          if (!mounted.current) return;
          setPosts([]);
          setStatus("empty");
          return;
        }

        // success with data
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

  // RENDER STATES
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

  // success
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">SmartStoxVest Blog</h1>
      {posts.map((post) => (
        <article key={post.id} className="mb-10 border-b pb-6">
          <h2 className="text-xl font-semibold mb-1">
            <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
              {post.title}
            </Link>
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            {new Date(post.created_at).toLocaleDateString()} •{" "}
            {post.tags?.split(",").map((t) => (
              <span key={t} className="text-blue-500 mr-2">#{t.trim()}</span>
            ))}
          </p>
          {post.image_url && (
            <img src={post.image_url} alt={post.title} className="my-3 rounded-md shadow-md max-w-md" />
          )}
          <div className="text-sm prose max-w-none text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {post.content.slice(0, 200) + "..."}
            </ReactMarkdown>
          </div>
          <Link to={`/blog/${post.slug}`} className="mt-3 inline-block text-blue-600 hover:underline text-sm">
            👉 Read Full Post
          </Link>
        </article>
      ))}
    </div>
  );
}
export default BlogList;
