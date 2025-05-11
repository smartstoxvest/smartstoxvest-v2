// ✅ BlogDetail.tsx (React component)
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// BlogPost type
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

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/posts/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        return fetch(`http://localhost:8000/api/posts/related/${data.slug}`);
      })
      .then((res) => res.json())
      .then((relatedData) => setRelated(relatedData))
      .catch((err) => console.error("Error fetching post or related:", err));
  }, [slug]);

  if (!post) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-2">
        {new Date(post.created_at).toLocaleDateString()} by {post.author}
      </p>

      {/* Tags */}
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

      {/* Image */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt="Cover"
          className="rounded-lg mb-4 max-w-full shadow-md"
        />
      )}

      {/* Content */}
      <div
        className="whitespace-pre-wrap font-mono text-sm overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Social Sharing */}
      <div className="mt-6 flex gap-4">
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

      {/* Related Posts */}
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
  );
};

export default BlogDetail;
