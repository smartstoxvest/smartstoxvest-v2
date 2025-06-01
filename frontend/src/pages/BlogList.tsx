import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import TopNavigation from "@/components/TopNavigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// ✅ Types
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

  if (!isAdmin) {
    return (
      <>
        
        <div className="p-6 text-center text-red-600 font-semibold">
          ⛔ You are not authorized to view the blog list.
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="max-w-5xl mx-auto px-6 py-8 text-gray-800">
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-3xl">📚</span>
          <h1 className="text-2xl font-bold">All Blog Posts</h1>
        </div>

        {posts.map((post) => (
          <div key={post.id} className="mb-8 border-b pb-6">
            <h2 className="text-xl font-semibold mb-1">
              <Link
                to={`/app/blog/${post.slug}`}
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

            <div className="text-sm prose max-w-none text-gray-700">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {post.content.slice(0, 200) + "..."}
              </ReactMarkdown>
            </div>

            <div className="flex justify-between items-center mt-3">
              <Link
                to={`/app/blog/${post.slug}`}
                className="text-blue-500 hover:underline text-sm"
              >
                👉 Read Full Post
              </Link>
              <Link
                to={`/app/admin/edit/${post.slug}`}
                className="text-sm text-green-600 hover:underline"
              >
                ✏️ Edit Post
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BlogList;
