import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import TopNavigation from "@/components/TopNavigation";

const API_URL = import.meta.env.VITE_API_URL;

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  author: string;
  tags: string;
  image_url?: string;
  created_at: string;
};

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const { user } = useAuth() as AuthContextType;
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/posts/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        return fetch(`${API_URL}/api/posts/related/${data.slug}`);
      })
      .then((res) => res.json())
      .then((relatedData) => setRelated(relatedData))
      .catch((err) => console.error("Error fetching post or related:", err));
  }, [slug]);

  if (!post) return <div className="p-6">Loading...</div>;

  return (
    <>
      
      <div className="max-w-4xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-2">
          {new Date(post.created_at).toLocaleDateString()} by {post.author}
        </p>

        {isAdmin && (
          <div className="mb-4">
            <button
              onClick={() => navigate(`/app/admin/edit/${post.slug}`)}
              className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500 text-sm"
            >
              ✏️ Edit This Post
            </button>
          </div>
        )}

        {post.tags && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.split(",").map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {post.image_url && (
          <img
            src={post.image_url}
            alt="Cover"
            className="rounded-lg mb-4 max-w-full shadow-md"
          />
        )}

        <div
          className="whitespace-pre-wrap font-mono text-sm overflow-x-auto mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-6 flex gap-4 border-t pt-4">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              post.title
            )}&url=https://smartstoxvest.com/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            🚀 Share on Twitter
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=https://smartstoxvest.com/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline text-sm"
          >
            📈 Share on LinkedIn
          </a>
        </div>

        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">🔁 Related Posts</h2>
          {related.length === 0 ? (
            <p className="text-sm text-gray-500">No related posts found.</p>
          ) : (
            <ul className="space-y-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <a
                    href={`/blog/${item.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {item.title}
                  </a>{" "}
                  <span className="text-xs text-gray-400">
                    ({new Date(item.created_at).toLocaleDateString()})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
