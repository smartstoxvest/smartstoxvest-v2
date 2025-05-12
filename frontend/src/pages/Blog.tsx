import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;


interface BlogPost {
  slug: string;
  title: string;
  content: string;
  created_at: string;
  author?: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data: BlogPost[]) => {
        const sorted = data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setPosts(sorted);
      })
      .catch((err) => console.error("Failed to load posts:", err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📝 SmartStoxVest Blog</h1>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <div key={post.slug} className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">
            <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
              {post.title}
            </Link>
          </h2>
          <p className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()} | By {post.author || "SmartStoxVest Team"}
          </p>
          <p className="text-gray-700 mt-2 line-clamp-3">
            {post.content.slice(0, 150)}...
          </p>
        </div>
      ))}
    </div>
  );
};

export default Blog;
