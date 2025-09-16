import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface User { email: string; }
interface AuthContextType { user: User | null; }
const API_URL = import.meta.env.VITE_API_URL;

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  tags: string;
  author: string;
  content: string;
  image_url?: string;
  created_at: string;
}

type Status = "loading" | "success" | "empty" | "error";

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [err, setErr] = useState<string | null>(null);

  const { user } = useAuth() as AuthContextType;
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

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
        await new Promise(r => setTimeout(r, backoffMs * Math.pow(2, i))); // 0.6s, 1.2s, 2.4s
      }
    }
    setErr(String(lastErr));
    setStatus("error");
  }

  useEffect(() => {
    fetchWithRetry();
    // optional: warm the backend quickly so next navigations are snappy
    fetch(`${API_URL}/healthz`).catch(() => {});
  }, []);

  // If your router uses <BrowserRouter basename="/app">, DO NOT prefix Links with "/app".
  const urlToPost = (slug: string) => `/blog/${slug}`;
  const urlToEdit = (slug: string) => `/admin/edit/${slug}`;

  if (!isAdmin) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        ⛔ You are not authorized to view the blog list.
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
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
      <div className="max-w-5xl mx-auto px-6 py-8 text-center">
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
      <div className="max-w-5xl mx-auto px-6 py-8 text-center text-gray-700">
        No blog posts yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 text-gray-800">
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-3xl">📚</span>
        <h1 className="text-2xl font-bold">All Blog Posts</h1>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="mb-8 border-b pb-6">
          <h2 className="text-xl font-semibold mb-1">
            <Link to={urlToPost(post.slug)} className="text-blue-600 hover:underline">
              {post.title}
            </Link>
          </h2>

          <p className="text-sm text-gray-500 mb-1">
            {new Date(post.created_at).toLocaleDateString()} | Tags:{" "}
            {post.tags?.split(",").map((tag) => (
              <span key={tag} className="text-blue-500 mr-2">#{tag.trim()}</span>
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

          <div className="flex justify-between items-center mt-3">
            <Link to={urlToPost(post.slug)} className="text-blue-500 hover:underline text-sm">
              👉 Read Full Post
            </Link>
            <Link to={urlToEdit(post.slug)} className="text-sm text-green-600 hover:underline">
              ✏️ Edit Post
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
