import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Define types
type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  tags: string;
  created_at: string;
  author?: string;
};

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const { user } = useAuth() as AuthContextType;
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    fetch(`${API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a: BlogPost, b: BlogPost) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setAllPosts(sorted);
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  useEffect(() => {
    if (slug) {
      fetch(`${API_URL}/api/posts/${slug}`)
        .then((res) => res.json())
        .then((data) => setPost(data))
        .catch((err) => console.error("Error fetching post:", err));
    }
  }, [slug]);

  if (!post) return <div className="p-6">Loading post...</div>;

  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost =
    currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(post.created_at).toLocaleDateString()} | Tags: {post.tags}{" "}
        {post.author && `| By ${post.author}`}
      </p>

      {isAdmin && (
        <Link
          to={`/admin/edit/${post.slug}`}
          className="text-blue-600 hover:underline text-sm block mb-4"
        >
          ✏️ Edit This Post
        </Link>
      )}

      <div className="prose prose-lg max-w-none text-justify mb-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            img: ({ src, alt }) => (
              <img
                src={`${API_URL}${src}`}
                alt={alt}
                className="max-w-full h-auto rounded-lg my-4"
              />
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <div className="flex justify-between border-t pt-6 mt-6 text-sm">
        {prevPost ? (
          <Link
            to={`/blog/${prevPost.slug}`}
            className="text-blue-600 hover:underline"
          >
            ← {prevPost.title}
          </Link>
        ) : (
          <span />
        )}

        {nextPost ? (
          <Link
            to={`/blog/${nextPost.slug}`}
            className="text-blue-600 hover:underline ml-auto"
          >
            {nextPost.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>

      <div className="pt-4 border-t mt-6">
        <Link to="/blog" className="text-blue-600 hover:underline text-sm">
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
};

export default BlogPost;
