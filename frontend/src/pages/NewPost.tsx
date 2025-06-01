import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import toast from "react-hot-toast";
import TopNavigation from "@/components/TopNavigation";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const customOptions: any = {
  spellChecker: false,
  toolbar: [
    "bold", "italic", "heading", "|",
    "quote", "unordered-list", "ordered-list", "|",
    "preview", "fullscreen", "guide"
  ]
};

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const { user } = useAuth();
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  if (!isAdmin) {
    return (
      <>
        
        <div className="p-6 text-red-600 text-center font-semibold">
          ⛔ You are not authorized to create blog posts.
        </div>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const postData = {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      tags,
      author: author || "SmartStoxVest Team",
      content,
    };

    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const text = await res.text();

      if (res.ok) {
        toast.success("🎉 Post published!");
        navigate("/app/blog");
      } else {
        try {
          const errorData = JSON.parse(text);
          toast.error(`❌ ${errorData.detail || "Failed to publish post"}`);
        } catch {
          toast.error("❌ Failed to publish post (Invalid response)");
        }
      }
    } catch (error) {
      console.error("⚠️ Network error:", error);
      toast.error("⚠️ Something went wrong while publishing.");
    }
  };

  return (
    <>
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-3xl">✍️</span>
          <h1 className="text-2xl font-bold">New Blog Post</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Slug (optional)"
            className="w-full border p-2 rounded"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="w-full border p-2 rounded"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            className="w-full border p-2 rounded"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <SimpleMDE value={content} onChange={setContent} options={customOptions} />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            🚀 Publish Post
          </button>
        </form>
      </div>
    </>
  );
};

export default NewPost;
