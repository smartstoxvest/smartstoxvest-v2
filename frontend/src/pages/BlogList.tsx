import { useEffect, useState } from "react";
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
  const [posts, setPosts] = useState<BlogPost[] | null>(null); // null = loading
  const [status, setStatus] = useState<Status>("loading");
  const [err, setErr] = useState<string | null>(null);

  async function fetchWithRetry(tries = 3, backoffMs = 600) {
    let lastErr: unknown = null;
    for (let i = 0; i < tries; i++) {
      try {
        const res = await fetch(`${API_URL}/api/posts`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BlogPost[] = await res.json();
        setPosts(data);
        setStatus(data.length ? "success" : "empty");
        return;
      } catch (e) {
        lastErr = e;
        await new Promise(r => setTimeout(r, backoffMs * Math.pow(2, i))); // 0.6s → 1.2s → 2.4s
      }
    }
    setErr(String(lastErr));
    setStatus("error");
  }

  useEffect(() => {
    fetchWithRetry();
    // Warm the backend to reduce first-load lag (Render cold start).
    fetch(`${API_URL}/healthz`).catch(() => {});
  }, []);

  // 👇 Render states
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
        <button onClick={() => fetchWithRetry()} className="mt-3 px-4 py-2 rounded bg-blue-600 text-white">
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
          {post.image_url && <img src={post.image_url} alt={post.title} className="my-3 rounded-md shadow-md max-w-md" />}
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
