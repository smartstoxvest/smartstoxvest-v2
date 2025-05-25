import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// ✅ Define User and Auth types (or import if globally defined)
interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
}

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

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { user } = useAuth() as AuthContextType;

  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    fetch(`${API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching blog posts:", err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">📝 SmartStoxVest Blog</h1>

      {posts.map((post) => (
        <div key={post.id} className="mb-8 border-b pb-6">
          <h2 className="text-xl font-semibold mb-1">
            <Link
              to={`/blog/${post.slug}`}
              className="text-blue-600 hover:underline"
            >
              {post.title}
            </Link>
          </h2>

          <p className="text-sm text-gray-500 mb-1">
            {new Date(post.created_at).toLocaleDateString()} | Tags:{" "}
            {post.tags
              ?.split(",")
              .map((tag) => (
                <span key={tag} className="text-blue-500 mr-2">
                  #{tag.trim()}
                </span>
              ))}
          </p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="my-3 rounded-md shadow-md max-w-md"
            />
          )}

          <div
            className="whitespace-pre-wrap font-mono text-sm overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {isAdmin && (
            <Link
              to={`/admin/edit/${post.slug}`}
              className="text-sm text-green-600 hover:underline mt-2 block"
            >
              ✏️ Edit Post
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default BlogList;
